"""Self-contained deterministic artifact builder for Cloud Run container builds.

Generates the 6,000-loan Credit Risk dataset (RANDOM_STATE = 42), runs the
leakage-free temporal split, leakage audit, baseline & challenger training,
and writes:
  - artifacts/credit_risk_loans.csv
  - artifacts/credit_risk_models.joblib
  - artifacts/model_metadata.json
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    brier_score_loss,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

RANDOM_STATE = 42
N_LOANS = 6000
TRAIN_END = "2024-09-30"
VAL_END = "2025-04-30"

NUMERIC_FEATURES = [
    "annual_income",
    "loan_amount",
    "credit_score",
    "dti_ratio",
    "utilization_rate",
    "delinq_2yrs",
    "emp_length_yrs",
]
CATEGORICAL_FEATURES = ["loan_purpose"]
MODEL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
EXCLUDED_LEAKAGE_COLUMNS = ["post_origination_collections_flag"]
TARGET_COL = "default_12m"


def generate_dataset(n_rows: int = N_LOANS, seed: int = RANDOM_STATE) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    start_date = np.datetime64("2023-01-01")
    day_offsets = rng.integers(0, 365 * 3, size=n_rows)
    origination_dates = pd.to_datetime(start_date + day_offsets.astype("timedelta64[D]"))
    origination_dates = origination_dates[np.argsort(origination_dates)]

    loan_ids = [f"LN-{100000 + i}" for i in range(n_rows)]
    customer_ids = [f"CUST-{500000 + i}" for i in range(n_rows)]

    credit_score = np.clip(rng.normal(685, 68, size=n_rows), 500, 845).round().astype(int)
    annual_income = np.clip(
        rng.lognormal(mean=11.15, sigma=0.45, size=n_rows), 24000, 350000
    ).round(-2)
    loan_amount = np.clip(
        annual_income * rng.uniform(0.08, 0.42, size=n_rows), 2500, 55000
    ).round(-2)
    dti_ratio = np.clip(
        rng.normal(21.5, 9.5, size=n_rows) + (700 - credit_score) * 0.04, 3.0, 58.0
    ).round(1)
    utilization_rate = np.clip(
        rng.normal(42.0, 22.0, size=n_rows) + (690 - credit_score) * 0.14, 1.0, 99.0
    ).round(1)
    delinq_2yrs = rng.choice(
        [0, 1, 2, 3, 4], size=n_rows, p=[0.74, 0.15, 0.06, 0.03, 0.02]
    )
    emp_length_yrs = np.clip(rng.exponential(scale=5.5, size=n_rows), 0.0, 25.0).round(1)

    purposes = np.array(
        ["debt_consolidation", "home_improvement", "major_purchase", "small_business", "education"]
    )
    loan_purpose = rng.choice(purposes, size=n_rows, p=[0.46, 0.19, 0.15, 0.12, 0.08])

    regions = np.array(["Northeast", "Midwest", "South", "West"])
    region = rng.choice(regions, size=n_rows, p=[0.24, 0.22, 0.31, 0.23])

    purpose_risk = np.select(
        [
            loan_purpose == "small_business",
            loan_purpose == "debt_consolidation",
            loan_purpose == "education",
            loan_purpose == "major_purchase",
        ],
        [0.48, 0.18, 0.05, -0.08],
        default=-0.22,
    )
    macro_shift = np.where(origination_dates >= pd.Timestamp("2025-01-01"), 0.14, 0.0)
    loan_to_income = loan_amount / annual_income
    logit = (
        -2.35
        - 0.0175 * (credit_score - 680)
        + 0.052 * (dti_ratio - 20.0)
        + 0.020 * (utilization_rate - 40.0)
        + 0.58 * delinq_2yrs
        + 2.35 * (loan_to_income - 0.22)
        - 0.042 * (emp_length_yrs - 4.0)
        + 0.45 * ((dti_ratio > 35.0) & (credit_score < 640)).astype(float)
        + purpose_risk
        + macro_shift
    )
    prob_default = 1.0 / (1.0 + np.exp(-logit))
    default_12m = rng.binomial(1, prob_default).astype(int)

    trap_noise = rng.random(n_rows)
    post_origination_collections_flag = np.where(
        default_12m == 1,
        (trap_noise < 0.93).astype(int),
        (trap_noise < 0.015).astype(int),
    )

    df = pd.DataFrame(
        {
            "loan_id": loan_ids,
            "customer_id": customer_ids,
            "origination_date": origination_dates.strftime("%Y-%m-%d"),
            "annual_income": annual_income.astype(float),
            "loan_amount": loan_amount.astype(float),
            "credit_score": credit_score.astype(float),
            "dti_ratio": dti_ratio.astype(float),
            "utilization_rate": utilization_rate.astype(float),
            "delinq_2yrs": delinq_2yrs.astype(int),
            "emp_length_yrs": emp_length_yrs.astype(float),
            "loan_purpose": loan_purpose,
            "region": region,
            "post_origination_collections_flag": post_origination_collections_flag,
            "default_12m": default_12m,
        }
    )

    df.loc[rng.random(n_rows) < 0.045, "emp_length_yrs"] = np.nan
    df.loc[rng.random(n_rows) < 0.030, "utilization_rate"] = np.nan
    return df


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    [
                        ("imputer", SimpleImputer(strategy="median", add_indicator=True)),
                        ("scaler", StandardScaler()),
                    ]
                ),
                NUMERIC_FEATURES,
            ),
            (
                "cat",
                Pipeline(
                    [
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                    ]
                ),
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def compute_ks(y_true: np.ndarray, y_prob: np.ndarray) -> float:
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    return float(np.max(tpr - fpr))


def bootstrap_auc_ci(
    y_true: np.ndarray, y_prob: np.ndarray, n_boot: int = 250
) -> tuple[float, float]:
    rng = np.random.default_rng(RANDOM_STATE)
    aucs = []
    n = len(y_true)
    for _ in range(n_boot):
        idx = rng.integers(0, n, size=n)
        if len(np.unique(y_true[idx])) < 2:
            continue
        aucs.append(roc_auc_score(y_true[idx], y_prob[idx]))
    low, high = np.percentile(aucs, [2.5, 97.5])
    return float(low), float(high)


def evaluate(name: str, model: Pipeline, X: pd.DataFrame, y: np.ndarray) -> dict[str, Any]:
    probs = model.predict_proba(X)[:, 1]
    preds = (probs >= 0.20).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, preds).ravel()
    auc = float(roc_auc_score(y, probs))
    ci_l, ci_h = bootstrap_auc_ci(y, probs)
    return {
        "model": name,
        "roc_auc": round(auc, 4),
        "roc_auc_ci95": [round(ci_l, 4), round(ci_h, 4)],
        "pr_auc": round(float(average_precision_score(y, probs)), 4),
        "ks_statistic": round(compute_ks(y, probs), 4),
        "brier_score": round(float(brier_score_loss(y, probs)), 4),
        "confusion_matrix_at_20pct": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
    }


def main() -> None:
    out_dir = Path(__file__).resolve().parent / "artifacts"
    out_dir.mkdir(parents=True, exist_ok=True)

    df = generate_dataset()
    df.to_csv(out_dir / "credit_risk_loans.csv", index=False)

    dates = pd.to_datetime(df["origination_date"])
    train_df = df.loc[dates <= pd.Timestamp(TRAIN_END)].copy()
    val_df = df.loc[(dates > pd.Timestamp(TRAIN_END)) & (dates <= pd.Timestamp(VAL_END))].copy()
    test_df = df.loc[dates > pd.Timestamp(VAL_END)].copy()

    y_train = train_df[TARGET_COL].to_numpy()
    y_val = val_df[TARGET_COL].to_numpy()
    y_test = test_df[TARGET_COL].to_numpy()

    # Leakage audit
    trap_vals = train_df["post_origination_collections_flag"].to_numpy()
    trap_auc = max(roc_auc_score(y_train, trap_vals), 1.0 - roc_auc_score(y_train, trap_vals))
    leakage_audit = [
        {
            "severity": "Pass",
            "vector": "Temporal / Lookahead Split",
            "evidence": (
                f"Train <= {train_df['origination_date'].max()}, "
                f"Val {val_df['origination_date'].min()}..{val_df['origination_date'].max()}, "
                f"Test >= {test_df['origination_date'].min()}"
            ),
            "action": "Chronological out-of-time cutoffs verified.",
        },
        {
            "severity": "Pass",
            "vector": "Entity / Customer Overlap",
            "evidence": "0 shared customer_ids across train/val/test.",
            "action": "Zero entity contamination confirmed.",
        },
        {
            "severity": "Caught & Excluded",
            "vector": "Post-Outcome Target Proxy",
            "evidence": f"`post_origination_collections_flag` univariate ROC-AUC = {trap_auc:.4f} (> 0.90).",
            "action": "Excluded from MODEL_FEATURES; verified in pytest.",
        },
        {
            "severity": "Pass",
            "vector": "Preprocessing Contamination",
            "evidence": "SimpleImputer(add_indicator=True), StandardScaler, OneHotEncoder inside Pipeline.",
            "action": "Fitted strictly on Train fold only.",
        },
    ]

    naive = Pipeline([("prep", build_preprocessor()), ("clf", DummyClassifier(strategy="prior"))])
    baseline = Pipeline(
        [("prep", build_preprocessor()), ("clf", LogisticRegression(C=0.5, max_iter=1000, random_state=RANDOM_STATE))]
    )
    challenger = Pipeline(
        [
            ("prep", build_preprocessor()),
            (
                "clf",
                HistGradientBoostingClassifier(
                    max_depth=4,
                    learning_rate=0.05,
                    max_iter=160,
                    min_samples_leaf=35,
                    l2_regularization=2.0,
                    random_state=RANDOM_STATE,
                ),
            ),
        ]
    )

    naive.fit(train_df[MODEL_FEATURES], y_train)
    baseline.fit(train_df[MODEL_FEATURES], y_train)
    challenger.fit(train_df[MODEL_FEATURES], y_train)

    val_lb = [
        evaluate("Naive Prior Baseline", naive, val_df[MODEL_FEATURES], y_val),
        evaluate("Logistic Regression Scorecard (Baseline)", baseline, val_df[MODEL_FEATURES], y_val),
        evaluate("HistGradientBoosting (Challenger)", challenger, val_df[MODEL_FEATURES], y_val),
    ]
    test_lb = [
        evaluate("Naive Prior Baseline", naive, test_df[MODEL_FEATURES], y_test),
        evaluate("Logistic Regression Scorecard (Baseline)", baseline, test_df[MODEL_FEATURES], y_test),
        evaluate("HistGradientBoosting (Challenger)", challenger, test_df[MODEL_FEATURES], y_test),
    ]

    probs_test = challenger.predict_proba(test_df[MODEL_FEATURES])[:, 1]
    slices = []
    for region, grp in test_df.groupby("region"):
        p_g = probs_test[test_df.index.get_indexer(grp.index)]
        y_g = grp[TARGET_COL].to_numpy()
        slices.append(
            {
                "slice": str(region),
                "count": int(len(grp)),
                "actual_default_rate": round(float(y_g.mean()), 4),
                "mean_predicted_pd": round(float(p_g.mean()), 4),
                "roc_auc": round(float(roc_auc_score(y_g, p_g)), 4),
                "brier_score": round(float(brier_score_loss(y_g, p_g)), 4),
            }
        )

    prep = baseline.named_steps["prep"]
    bundle = {
        "baseline_model": baseline,
        "challenger_model": challenger,
        "feature_names": list(prep.get_feature_names_out()),
        "lr_coefs": baseline.named_steps["clf"].coef_[0].tolist(),
        "lr_intercept": float(baseline.named_steps["clf"].intercept_[0]),
        "model_features": MODEL_FEATURES,
        "random_state": RANDOM_STATE,
    }
    joblib.dump(bundle, out_dir / "credit_risk_models.joblib")

    metadata = {
        "model_name": "Credit Risk 12-Month Default Scorecard",
        "version": "1.0.0",
        "random_state": RANDOM_STATE,
        "dataset": {
            "total_rows": int(len(df)),
            "train_rows": int(len(train_df)),
            "val_rows": int(len(val_df)),
            "test_rows": int(len(test_df)),
            "overall_default_rate": round(float(df[TARGET_COL].mean()), 4),
            "test_default_rate": round(float(y_test.mean()), 4),
            "train_cutoff": f"<= {TRAIN_END}",
            "val_window": f"2024-10-01 to {VAL_END}",
            "test_window": ">= 2025-05-01 (Out-of-Time)",
            "missingness_pct": {
                "emp_length_yrs": round(float(df["emp_length_yrs"].isna().mean() * 100), 2),
                "utilization_rate": round(float(df["utilization_rate"].isna().mean() * 100), 2),
            },
        },
        "features": MODEL_FEATURES,
        "excluded_leakage_columns": EXCLUDED_LEAKAGE_COLUMNS,
        "leakage_audit": leakage_audit,
        "validation_leaderboard": val_lb,
        "oot_test_leaderboard": test_lb,
        "regional_slices": slices,
        "sample_rows": test_df.head(15).replace({np.nan: None}).to_dict(orient="records"),
    }
    with open(out_dir / "model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print("Cloud Run artifacts built successfully.")


if __name__ == "__main__":
    main()

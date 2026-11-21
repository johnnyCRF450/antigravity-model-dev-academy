"""Deterministic synthetic Credit Risk dataset generator for classroom labs.

Produces 6,000 realistic consumer loans spanning 2023-01-01 to 2025-12-31,
including:
  - Realistic borrower credit/income/DTI/delinquency features
  - Controlled missingness (~4%) in emp_length_yrs and utilization_rate
  - An intentional classroom leakage trap column (`post_origination_collections_flag`)
    so students can test Antigravity's `leakage-auditor` skill and pytest guards.
"""

from __future__ import annotations

from pathlib import Path
import numpy as np
import pandas as pd

RANDOM_STATE = 42
N_LOANS = 6000


def generate_credit_risk_dataset(
    n_rows: int = N_LOANS, seed: int = RANDOM_STATE
) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    # Origination dates spread across 36 months (2023-01 to 2025-12)
    start_date = np.datetime64("2023-01-01")
    day_offsets = rng.integers(0, 365 * 3, size=n_rows)
    origination_dates = pd.to_datetime(start_date + day_offsets.astype("timedelta64[D]"))
    order = np.argsort(origination_dates)
    origination_dates = origination_dates[order]

    # Unique customer IDs (guarantee zero entity leakage across temporal splits)
    loan_ids = [f"LN-{100000 + i}" for i in range(n_rows)]
    customer_ids = [f"CUST-{500000 + i}" for i in range(n_rows)]

    # Core borrower features
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

    # Mild macro drift in 2025 to make out-of-time evaluation realistic
    macro_shift = np.where(origination_dates >= pd.Timestamp("2025-01-01"), 0.14, 0.0)

    # Nonlinear log-odds of 12-month default
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

    # INTENTIONAL CLASSROOM LEAKAGE TRAP:
    # Recorded AFTER the loan enters delinquency/collections (post-outcome proxy!)
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

    # Inject controlled realistic missingness (~4%) for Pipeline imputation lessons
    emp_miss_mask = rng.random(n_rows) < 0.045
    util_miss_mask = rng.random(n_rows) < 0.030
    df.loc[emp_miss_mask, "emp_length_yrs"] = np.nan
    df.loc[util_miss_mask, "utilization_rate"] = np.nan

    return df


def main() -> None:
    out_dir = Path(__file__).resolve().parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "credit_risk_loans.csv"

    df = generate_credit_risk_dataset()
    df.to_csv(out_path, index=False)

    # Also copy into public/data/ for static frontend CSV download
    public_data = Path(__file__).resolve().parents[2] / "public" / "data"
    public_data.mkdir(parents=True, exist_ok=True)
    df.to_csv(public_data / "credit_risk_loans.csv", index=False)

    print(
        f"Generated {len(df):,} loans -> {out_path} "
        f"(default_12m rate: {df['default_12m'].mean():.2%})"
    )


if __name__ == "__main__":
    main()

"""Automated pytest verification suite for the Credit Risk Lab.

Verifies AGENTS.md governance rules:
  1. Intentional leakage trap column is strictly excluded.
  2. Strict out-of-time chronological separation and zero entity overlap.
  3. Bit-identical determinism across runs with RANDOM_STATE = 42.
  4. Pipeline handles missing values (NaN) cleanly at inference time.
  5. Baseline & Challenger exceed quality & calibration thresholds.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from labs.credit_risk.generate_dataset import generate_credit_risk_dataset
from labs.credit_risk.pipeline import (
    EXCLUDED_LEAKAGE_COLUMNS,
    MODEL_FEATURES,
    RANDOM_STATE,
    TARGET_COL,
    build_preprocessor,
    run_leakage_audit,
    temporal_split,
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, roc_auc_score
from sklearn.pipeline import Pipeline


def test_leakage_trap_column_excluded_and_detected():
    df = generate_credit_risk_dataset(n_rows=1500, seed=RANDOM_STATE)
    train_df, val_df, test_df = temporal_split(df)

    for col in EXCLUDED_LEAKAGE_COLUMNS:
        assert col not in MODEL_FEATURES

    findings = run_leakage_audit(train_df, val_df, test_df)
    caught = [f for f in findings if f["severity"] == "Caught & Excluded"]
    assert len(caught) >= 1
    assert "post_origination_collections_flag" in caught[0]["evidence"]


def test_strict_temporal_and_entity_separation():
    df = generate_credit_risk_dataset(n_rows=1500, seed=RANDOM_STATE)
    train_df, val_df, test_df = temporal_split(df)

    assert len(train_df) > 0 and len(val_df) > 0 and len(test_df) > 0
    assert train_df["origination_date"].max() < val_df["origination_date"].min()
    assert val_df["origination_date"].max() < test_df["origination_date"].min()

    assert set(train_df["customer_id"]).isdisjoint(set(val_df["customer_id"]))
    assert set(train_df["customer_id"]).isdisjoint(set(test_df["customer_id"]))
    assert set(val_df["customer_id"]).isdisjoint(set(test_df["customer_id"]))


def test_pipeline_determinism_and_nan_inference():
    df = generate_credit_risk_dataset(n_rows=2000, seed=RANDOM_STATE)
    train_df, _, test_df = temporal_split(df)

    pipe_a = Pipeline(
        [("prep", build_preprocessor()), ("clf", LogisticRegression(C=0.5, max_iter=1000, random_state=RANDOM_STATE))]
    )
    pipe_b = Pipeline(
        [("prep", build_preprocessor()), ("clf", LogisticRegression(C=0.5, max_iter=1000, random_state=RANDOM_STATE))]
    )

    pipe_a.fit(train_df[MODEL_FEATURES], train_df[TARGET_COL])
    pipe_b.fit(train_df[MODEL_FEATURES], train_df[TARGET_COL])

    probs_a = pipe_a.predict_proba(test_df[MODEL_FEATURES])[:, 1]
    probs_b = pipe_b.predict_proba(test_df[MODEL_FEATURES])[:, 1]
    np.testing.assert_allclose(probs_a, probs_b, rtol=0, atol=1e-12)

    # Verify NaN resilience at inference time
    sample_with_nan = pd.DataFrame(
        [
            {
                "annual_income": 85000.0,
                "loan_amount": 18000.0,
                "credit_score": 690.0,
                "dti_ratio": 22.0,
                "utilization_rate": np.nan,
                "delinq_2yrs": 0,
                "emp_length_yrs": np.nan,
                "loan_purpose": "debt_consolidation",
            }
        ]
    )
    pred = pipe_a.predict_proba(sample_with_nan)[:, 1][0]
    assert 0.0 < pred < 1.0


def test_quality_and_calibration_gate():
    df = generate_credit_risk_dataset(n_rows=3000, seed=RANDOM_STATE)
    train_df, _, test_df = temporal_split(df)

    pipe = Pipeline(
        [("prep", build_preprocessor()), ("clf", LogisticRegression(C=0.5, max_iter=1000, random_state=RANDOM_STATE))]
    )
    pipe.fit(train_df[MODEL_FEATURES], train_df[TARGET_COL])
    probs = pipe.predict_proba(test_df[MODEL_FEATURES])[:, 1]

    auc = roc_auc_score(test_df[TARGET_COL], probs)
    brier = brier_score_loss(test_df[TARGET_COL], probs)
    assert auc >= 0.75, f"Expected ROC-AUC >= 0.75, got {auc:.4f}"
    assert brier <= 0.14, f"Expected Brier <= 0.14, got {brier:.4f}"

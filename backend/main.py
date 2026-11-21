"""Live GCP Cloud Run FastAPI Demo Backend — Credit Risk 12-Month Default Scorecard.

Serves:
  - GET  /health          : Cloud Run readiness, revision & latency probe
  - GET  /model-info      : Real OOT leaderboard, leakage audit, regional slices & dataset stats
  - GET  /dataset/sample  : Realistic sample rows from credit_risk_loans.csv
  - POST /predict         : Real-time scoring from BOTH Baseline (Logistic) and Challenger (GBDT)
                            plus standardized scorecard risk drivers & Expected Loss calculation.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_BUNDLE_PATH = ARTIFACTS_DIR / "credit_risk_models.joblib"
METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"
CSV_PATH = ARTIFACTS_DIR / "credit_risk_loans.csv"

LGD = 0.45  # Standard unsecured consumer Loss Given Default assumption (45%)

app = FastAPI(
    title="Antigravity Model Dev Academy — Live Credit Risk API",
    description=(
        "Live GCP Cloud Run inference & model-governance API powering the "
        "Credit Risk Scorecard Lab (Baseline Logistic Regression vs. HistGradientBoosting)."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts once on container startup
BUNDLE = joblib.load(MODEL_BUNDLE_PATH)
with open(METADATA_PATH, "r", encoding="utf-8") as f:
    METADATA = json.load(f)

BASELINE_MODEL = BUNDLE["baseline_model"]
CHALLENGER_MODEL = BUNDLE["challenger_model"]
FEATURE_NAMES: list[str] = BUNDLE["feature_names"]
LR_COEFS = np.array(BUNDLE["lr_coefs"], dtype=float)


class LoanApplication(BaseModel):
    annual_income: float = Field(85000, ge=15000, le=500000)
    loan_amount: float = Field(18000, ge=1000, le=100000)
    credit_score: float = Field(685, ge=450, le=850)
    dti_ratio: float = Field(22.0, ge=0.0, le=70.0)
    utilization_rate: Optional[float] = Field(38.0, ge=0.0, le=100.0)
    delinq_2yrs: int = Field(0, ge=0, le=10)
    emp_length_yrs: Optional[float] = Field(5.0, ge=0.0, le=40.0)
    loan_purpose: Literal[
        "debt_consolidation",
        "home_improvement",
        "major_purchase",
        "small_business",
        "education",
    ] = "debt_consolidation"
    approval_threshold: float = Field(0.20, ge=0.05, le=0.60)


def _friendly_feature_label(raw_name: str) -> str:
    clean = raw_name.replace("num__", "").replace("cat__", "")
    mapping = {
        "credit_score": "Credit Score",
        "dti_ratio": "Debt-to-Income (DTI)",
        "utilization_rate": "Credit Utilization %",
        "delinq_2yrs": "Prior 2-Yr Delinquencies",
        "annual_income": "Annual Income",
        "loan_amount": "Requested Loan Amount",
        "emp_length_yrs": "Employment Length",
        "missingindicator_emp_length_yrs": "Missing Emp. Length Indicator",
        "missingindicator_utilization_rate": "Missing Utilization Indicator",
    }
    if clean in mapping:
        return mapping[clean]
    if clean.startswith("loan_purpose_"):
        return "Purpose: " + clean.replace("loan_purpose_", "").replace("_", " ").title()
    return clean


@app.get("/")
def root():
    return {
        "service": "Antigravity Model Dev Academy — Live Credit Risk API",
        "status": "online",
        "docs": "/docs",
        "endpoints": ["/health", "/model-info", "/dataset/sample", "/dataset/csv", "/predict"],
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": os.getenv("K_SERVICE", "credit-risk-demo-api"),
        "revision": os.getenv("K_REVISION", "local-dev"),
        "region": os.getenv("CLOUD_RUN_REGION", "us-central1"),
        "model_version": METADATA["version"],
        "random_state": METADATA["random_state"],
    }


@app.get("/model-info")
def model_info():
    return METADATA


@app.get("/dataset/sample")
def dataset_sample():
    return {
        "total_rows": METADATA["dataset"]["total_rows"],
        "excluded_leakage_columns": METADATA["excluded_leakage_columns"],
        "rows": METADATA["sample_rows"],
    }


@app.get("/dataset/csv")
def dataset_csv():
    return FileResponse(
        path=CSV_PATH,
        media_type="text/csv",
        filename="credit_risk_loans.csv",
    )


@app.post("/predict")
def predict(app_req: LoanApplication):
    row = pd.DataFrame(
        [
            {
                "annual_income": float(app_req.annual_income),
                "loan_amount": float(app_req.loan_amount),
                "credit_score": float(app_req.credit_score),
                "dti_ratio": float(app_req.dti_ratio),
                "utilization_rate": (
                    np.nan if app_req.utilization_rate is None else float(app_req.utilization_rate)
                ),
                "delinq_2yrs": int(app_req.delinq_2yrs),
                "emp_length_yrs": (
                    np.nan if app_req.emp_length_yrs is None else float(app_req.emp_length_yrs)
                ),
                "loan_purpose": app_req.loan_purpose,
            }
        ]
    )

    baseline_pd = float(BASELINE_MODEL.predict_proba(row)[:, 1][0])
    challenger_pd = float(CHALLENGER_MODEL.predict_proba(row)[:, 1][0])

    # Transparent per-feature standardized log-odds contributions from the scorecard baseline
    transformed = BASELINE_MODEL.named_steps["prep"].transform(row)[0]
    raw_contribs = transformed * LR_COEFS
    drivers = []
    for fname, val in zip(FEATURE_NAMES, raw_contribs):
        if abs(val) < 0.01:
            continue
        drivers.append(
            {
                "feature": _friendly_feature_label(fname),
                "log_odds_impact": round(float(val), 4),
                "direction": "increases_risk" if val > 0 else "reduces_risk",
            }
        )
    drivers.sort(key=lambda d: abs(d["log_odds_impact"]), reverse=True)

    # Tier & Decision based on challenger PD and caller threshold
    if challenger_pd < 0.08:
        risk_tier = "Prime"
    elif challenger_pd < 0.16:
        risk_tier = "Near-Prime"
    elif challenger_pd < 0.28:
        risk_tier = "Subprime"
    else:
        risk_tier = "High-Risk"

    thr = app_req.approval_threshold
    if challenger_pd <= thr * 0.85:
        decision = "Approve"
    elif challenger_pd <= thr * 1.20:
        decision = "Manual Review"
    else:
        decision = "Decline"

    expected_loss_usd = round(challenger_pd * LGD * app_req.loan_amount, 2)

    return {
        "baseline_pd": round(baseline_pd, 4),
        "challenger_pd": round(challenger_pd, 4),
        "pd_spread": round(challenger_pd - baseline_pd, 4),
        "risk_tier": risk_tier,
        "decision": decision,
        "approval_threshold": thr,
        "expected_loss_usd": expected_loss_usd,
        "lgd_assumption": LGD,
        "top_risk_drivers": drivers[:6],
        "served_by": {
            "service": os.getenv("K_SERVICE", "credit-risk-demo-api"),
            "revision": os.getenv("K_REVISION", "local-dev"),
        },
    }

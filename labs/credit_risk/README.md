# Credit Risk Scorecard Lab (12-Month Default Prediction)

This flagship classroom lab teaches **Vibe Coding → Agentic Verification → Production Cloud Run Deployment** using a realistic 6,000-loan credit risk dataset.

## Dataset Schema (`labs/credit_risk/data/credit_risk_loans.csv`)

| Column | Type | Notes |
| :--- | :--- | :--- |
| `loan_id`, `customer_id` | string | Unique identifiers (zero customer overlap across folds) |
| `origination_date` | date | Chronological split key (`2023-01-01` to `2025-12-31`) |
| `annual_income`, `loan_amount` | float | Borrower income and requested principal (USD) |
| `credit_score` | float | FICO-style bureau score (`500`–`845`) |
| `dti_ratio`, `utilization_rate` | float | Debt-to-income % and revolving utilization % (~3% NaN) |
| `delinq_2yrs`, `emp_length_yrs` | int/float | Prior 24-month delinquencies & tenure (~4.5% NaN) |
| `loan_purpose`, `region` | string | Nominal categories (`region` used for subgroup slice audits) |
| `post_origination_collections_flag` | int | **INTENTIONAL LEAKAGE TRAP!** Post-outcome proxy (AUC > 0.90) — must be caught and excluded! |
| `default_12m` | int | Binary target (`22.35%` overall default rate; `23.91%` out-of-time holdout) |

## Run Locally

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt pytest
.venv/bin/python labs/credit_risk/generate_dataset.py
.venv/bin/python labs/credit_risk/pipeline.py
.venv/bin/pytest labs/credit_risk/tests/ -v
```

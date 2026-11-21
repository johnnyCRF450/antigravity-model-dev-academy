# Model Card — Credit Risk 12-Month Default Scorecard (v1.0.0)

## 1. Model Overview
- **Intended Use:** Classroom demonstration and underwriting decision-support sandbox estimating 12-month probability of default (`default_12m`) at loan origination.
- **Out-of-Scope Uses:** Not approved for real consumer lending decisions; trained on synthetic teaching data (`RANDOM_STATE = 42`).

## 2. Data & Temporal Split Specification
- **Dataset:** `labs/credit_risk/data/credit_risk_loans.csv` (6,000 loans, 2023–2025, overall default rate 22.35%)
- **Train Split:** 3,543 loans (`origination_date <= 2024-09-30`)
- **Validation Split:** 1,127 loans (`2024-10-01` to `2025-04-30`)
- **Out-of-Time Test Split:** 1,330 loans (`origination_date >= 2025-05-01`)
- **Missingness Handling:** `emp_length_yrs` (4.35%) and `utilization_rate` (3.03%) imputed via training-fold median + binary missingness indicators inside `ColumnTransformer`.

## 3. Leakage Audit Summary
- **`post_origination_collections_flag`** was flagged by `run_leakage_audit` (univariate AUC > 0.90) as a post-outcome proxy and strictly excluded from `MODEL_FEATURES`.
- Zero date overlap and zero `customer_id` overlap verified across Train / Val / Test.

## 4. Quantitative Evaluation (Out-of-Time Test Set)

| Model | ROC-AUC (95% CI) | PR-AUC | KS Stat | Brier Score |
| :--- | :---: | :---: | :---: | :---: |
| Naive Prior Baseline | 0.5000 | 0.2391 | 0.0000 | 0.1824 |
| Logistic Regression Scorecard (Baseline) | 0.8658 (0.8413–0.8849) | 0.6869 | 0.5839 | 0.1188 |
| HistGradientBoosting (Challenger) | 0.8635 (0.8391–0.8850) | 0.6804 | 0.5686 | 0.1202 |

## 5. Regional Subgroup Diagnostics (OOT Test)

| Region | Loans | Actual Default | Mean Pred PD | ROC-AUC | Brier |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Midwest | 320 | 22.19% | 20.99% | 0.8369 | 0.1184 |
| Northeast | 312 | 24.36% | 24.04% | 0.8501 | 0.1300 |
| South | 369 | 23.58% | 22.21% | 0.8887 | 0.1080 |
| West | 329 | 25.53% | 22.81% | 0.8665 | 0.1263 |

## 6. Monitoring & Risk Controls
- Track quarterly Population Stability Index (PSI > 0.20 triggers recalibration).
- Maintain the Logistic Regression scorecard alongside the GBDT challenger for transparent adverse-action explanations.

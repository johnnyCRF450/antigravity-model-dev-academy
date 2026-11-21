---
description: Model validation and risk-management guardrails for ML pipelines and experiments
trigger: model_decision
---

# Model Validation Guardrails

Activate this rule whenever authoring, modifying, or reviewing model training, feature engineering, evaluation, or scoring code.

## Mandatory Pre-Commit Checks
1. **Out-of-Time / Out-of-Sample Separation**: Verify that validation and test sets are strictly isolated from training and hyperparameter selection.
2. **Baseline Comparison**: Confirm every candidate model is benchmarked against a transparent baseline on identical folds.
3. **Calibration & Thresholding**: For classification models, report both discrimination (ROC-AUC, PR-AUC) and probability calibration (Brier score or calibration curve), plus business-aligned threshold tradeoffs.
4. **Subgroup & Slice Diagnostics**: Evaluate performance across key segments (e.g., cohort, region, tenure, or protected-class proxy checks) to catch hidden degradation.
5. **Failure Mode Disclosure**: Explicitly list assumptions, edge cases, missing-value handling, and drift triggers in the summary output.

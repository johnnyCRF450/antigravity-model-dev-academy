---
name: leakage-auditor
description: Audits machine learning scripts, notebooks, and feature pipelines for target leakage, lookahead bias, and train/test contamination. Use before finalizing any model or reviewing student submissions.
---

# Leakage & Contamination Auditor Skill

Systematically inspect code and data artifacts across five leakage vectors:

## 1. Preprocessing Contamination
- Flag any `.fit()` or `.fit_transform()` called on the full DataFrame before splitting.
- Flag global `.fillna(df.mean())`, `.quantile()`, or target encoding computed outside cross-validation folds.

## 2. Temporal / Lookahead Bias
- Check whether random splitting is used on time-indexed data.
- Verify rolling windows, lag features, and aggregations only reference timestamps strictly earlier than the prediction timestamp (`t < t_pred`).

## 3. Group & Entity Overlap
- Check if the same customer, patient, account, or device appears in both train and test splits without `GroupKFold`.

## 4. Target Proxies & Post-Outcome Features
- Inspect top feature importances and univariate correlations; flag any feature generated *after* the label event (e.g., `collections_flag` predicting `default`).

## 5. Audit Report Format
Return a structured table with columns:
`Severity (Critical / High / Medium / Pass) | Vector | File & Line | Evidence | Concrete Fix`

---
name: ml-vibe-blueprint
description: Structured 5-phase Vibe-to-Verified Model Development workflow for Gemini Antigravity. Use when prototyping, building, or refactoring an ML model, notebook, or predictive analytics pipeline from a natural-language specification.
---

# ML Vibe-to-Verified Blueprint Skill

Follow this 5-phase loop whenever a student or model developer starts a new predictive modeling task in Antigravity.

## Phase 1: Problem & Contract Spec (Planning Mode)
Before writing model code, produce a concise implementation plan specifying:
- Target variable definition, prediction horizon, and unit of observation
- Split strategy (random stratified, group-aware, or time-based cutoff)
- Primary & secondary metrics aligned to business/scientific cost
- Hard constraints (latency, interpretability, regulatory requirements)

## Phase 2: Automated EDA & Data Health Audit
Generate and run an exploratory audit checking:
- Row/column counts, dtypes, duplicate keys, and missingness patterns
- Target class balance or distribution skew/outliers
- Potential leakage candidates (high-cardinality IDs, post-event timestamps, near-perfect target correlations)

## Phase 3: Reproducible Baseline Pipeline
Build a clean `Pipeline` (`ColumnTransformer` + simple interpretable model):
- Fit strictly on train split; score on validation split
- Log baseline metrics and save a confusion matrix / residual diagnostic

## Phase 4: Iterative Feature & Model Exploration
Propose 2–3 hypothesis-driven iterations (e.g., domain interaction features, GBDT challenger, regularized linear model with splines):
- Compare all candidates in a single Markdown leaderboard table
- Keep the winning model only if validation improvement is statistically meaningful and well-calibrated

## Phase 5: Verification & Deliverable Packaging
- Run automated tests verifying pipeline determinism, schema validation, and inference latency
- Invoke `leakage-auditor` and `model-card-generator` before marking complete

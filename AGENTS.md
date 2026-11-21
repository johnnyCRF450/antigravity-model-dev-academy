# AGENTS.md — Model Development Governance Rules

These rules apply automatically whenever **Gemini Antigravity** operates in this workspace. They ensure every "vibe coded" prototype meets rigorous model development standards.

## 1. Split Hygiene & Zero Leakage (Non-Negotiable)
- **Split BEFORE preprocessing:** Never fit scalers, imputers, encoders, PCA, or target encoders on the full dataset. Always wrap preprocessing inside a `scikit-learn` `Pipeline` / `ColumnTransformer` fitted exclusively on the training fold.
- **Temporal integrity:** For time-series, credit, fraud, or longitudinal data, default to chronological / expanding-window splits (`TimeSeriesSplit` or explicit cutoff dates) instead of random `train_test_split`.
- **Target leakage check:** Explicitly audit features for post-outcome proxies, ID columns, timestamps after the prediction point, or suspiciously high univariate AUC (> 0.95).

## 2. Reproducibility & Determinism
- Set explicit random seeds (`RANDOM_STATE = 42`) across NumPy, scikit-learn, PyTorch, and XGBoost/LightGBM.
- Pin library versions in `requirements.txt` or `pyproject.toml` and use virtual environments (never global `pip install`).

## 3. Baseline First, Complexity Second
- Always build and evaluate a simple, interpretable baseline (e.g., Logistic Regression, Ridge, or seasonal naive) **before** tuning GBDTs or deep neural networks.
- Report a comparison table across primary metric, secondary metric, calibration (Brier / ECE), and subgroup stability.

## 4. Verification Over Vibes
- Never present unexecuted code as verified. Run unit tests (`pytest`), schema checks, and a small synthetic or real smoke run after every material change.
- For UI dashboards or model apps, verify the live rendered output before finishing.

## 5. Documentation & Model Card Discipline
- Every finalized model artifact must include a short **Model Card** documenting intended use, data cutoffs, evaluation metrics, known limitations, and bias/drift risks.

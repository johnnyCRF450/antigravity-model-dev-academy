---
name: model-card-generator
description: Generates a standardized, stakeholder-ready Model Card (inspired by Mitchell et al. & SR 11-7) summarizing model purpose, data lineage, evaluation metrics, slice performance, and risk controls.
---

# Model Card Generator Skill

Create a `MODEL_CARD.md` file in the project root with these required sections:

1. **Model Overview**: Name, version, owner, intended use, and explicitly out-of-scope uses.
2. **Data & Split Specification**: Source tables/files, observation window, train/val/test cutoffs, and missingness/exclusion rules.
3. **Architecture & Features**: Model family, key engineered features, preprocessing pipeline, and random seed.
4. **Quantitative Evaluation**:
   - Baseline vs. Challenger comparison table
   - Calibration metrics & operating threshold rationale
   - Subgroup / slice performance table
5. **Risk, Bias & Monitoring Plan**:
   - Known failure modes and data drift indicators (PSI / feature distribution thresholds)
   - Retraining cadence and human-in-the-loop fallback triggers

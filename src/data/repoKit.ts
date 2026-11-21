export interface RepoKitFile {
  path: string;
  label: string;
  category: 'Rule' | 'Skill' | 'Workflow' | 'CI/CD';
  summary: string;
  content: string;
}

export const REPO_KIT_FILES: RepoKitFile[] = [
  {
    path: 'AGENTS.md',
    label: 'Root Governance Rules',
    category: 'Rule',
    summary: 'Automatically discovered at repository root by Antigravity IDE, 2.0, and CLI. Enforces split hygiene, reproducibility, baseline-first discipline, and Model Card creation.',
    content: `# AGENTS.md — Model Development Governance Rules

## 1. Split Hygiene & Zero Leakage (Non-Negotiable)
- Split BEFORE preprocessing: wrap scalers, imputers, and encoders inside sklearn Pipeline.
- Default to chronological / expanding-window splits for time-indexed data.
- Audit features for post-outcome proxies or suspiciously high univariate AUC (> 0.95).

## 2. Reproducibility & Determinism
- Set explicit random seeds (RANDOM_STATE = 42) across NumPy, sklearn, PyTorch, and GBDTs.
- Pin dependencies and always use project virtual environments.

## 3. Baseline First, Complexity Second
- Build an interpretable baseline (Logistic Regression / Ridge / Seasonal Naive) before tuning complex models.
- Report discrimination, calibration (Brier / ECE), and subgroup stability in one leaderboard.

## 4. Verification Over Vibes
- Never claim code works without executing pytest, schema checks, and smoke runs.

## 5. Model Card Discipline
- Every finalized model must ship with MODEL_CARD.md documenting scope, cutoffs, metrics, and drift triggers.`,
  },
  {
    path: '.agents/rules/model-validation.md',
    label: 'Validation Guardrails Rule',
    category: 'Rule',
    summary: 'Model-triggered rule enforcing out-of-time separation, calibration reporting, and subgroup slice diagnostics.',
    content: `---
description: Model validation and risk-management guardrails for ML pipelines
trigger: model_decision
---

# Model Validation Guardrails
1. Out-of-Time / Out-of-Sample Separation verified before hyperparameter search.
2. Baseline Comparison on identical folds.
3. Calibration & Thresholding (ROC-AUC, PR-AUC, Brier score, business threshold tradeoffs).
4. Subgroup & Slice Diagnostics across key cohorts.
5. Explicit Failure Mode Disclosure in summary artifacts.`,
  },
  {
    path: '.agents/skills/ml-vibe-blueprint/SKILL.md',
    label: 'ML Vibe-to-Verified Skill',
    category: 'Skill',
    summary: 'Progressive-disclosure 5-phase modeling skill guiding students from natural-language spec to verified model artifact.',
    content: `---
name: ml-vibe-blueprint
description: Structured 5-phase Vibe-to-Verified Model Development workflow for Gemini Antigravity.
---

# ML Vibe-to-Verified Blueprint Skill
- Phase 1: Problem & Contract Spec (Planning Mode)
- Phase 2: Automated EDA & Data Health Audit
- Phase 3: Reproducible Baseline Pipeline
- Phase 4: Iterative Feature & Challenger Exploration
- Phase 5: Automated Verification (pytest + leakage-auditor + model-card-generator)`,
  },
  {
    path: '.agents/skills/leakage-auditor/SKILL.md',
    label: 'Leakage Auditor Skill',
    category: 'Skill',
    summary: 'Audits ML scripts and notebooks across 5 leakage vectors and outputs a severity-ranked remediation report.',
    content: `---
name: leakage-auditor
description: Audits ML scripts, notebooks, and feature pipelines for target leakage, lookahead bias, and train/test contamination.
---

# Leakage & Contamination Auditor Skill
1. Preprocessing Contamination (.fit / .fillna / target encoding before split)
2. Temporal / Lookahead Bias (random splits on time data, centered rolling windows)
3. Group & Entity Overlap (same customer/account in train & test)
4. Target Proxies & Post-Outcome Features
5. Structured Output: Severity | Vector | File & Line | Evidence | Concrete Fix`,
  },
  {
    path: '.agents/skills/model-card-generator/SKILL.md',
    label: 'Model Card Generator Skill',
    category: 'Skill',
    summary: 'Generates stakeholder-ready MODEL_CARD.md documentation aligned to Mitchell et al. and SR 11-7 best practices.',
    content: `---
name: model-card-generator
description: Generates a standardized Model Card summarizing model purpose, data lineage, evaluation metrics, slice performance, and risk controls.
---

# Model Card Generator Skill
Required Sections:
1. Model Overview & Out-of-Scope Uses
2. Data & Split Specification
3. Architecture, Features & Random Seed
4. Quantitative Evaluation (Baseline vs. Challenger + Calibration + Slices)
5. Risk, Bias, Drift Triggers (PSI) & Retraining Cadence`,
  },
  {
    path: '.agents/workflows/model-review-swarm.md',
    label: 'Multi-Agent Review Swarm',
    category: 'Workflow',
    summary: '4-agent parallel model validation playbook (Coordinator + Leakage Auditor + Challenger Modeler + Model Card Writer).',
    content: `# Multi-Agent Model Review Swarm Playbook

| Role | Antigravity Mode | Workspace | Ownership |
| :--- | :--- | :--- | :--- |
| Coordinator | Main Agent | inherit | Contract, dispatch, Go/No-Go synthesis |
| Data & Leakage Auditor | Subagent (research) | inherit | leakage-auditor skill |
| Challenger Modeler | Subagent (self) | share | Independent baseline/challenger folds |
| Model Card & UI Verifier | Subagent (self + browser) | inherit | pytest, Browser check, MODEL_CARD.md |`,
  },
];

export const SLASH_COMMANDS_CHEATSHEET = [
  {
    cmd: '/plan',
    when: 'Before writing any new model pipeline or app',
    effect: 'Produces an editable step-by-step Plan Artifact for approval prior to execution.',
  },
  {
    cmd: '/grill-me',
    when: 'Kicking off a capstone project or unclear modeling problem',
    effect: 'Runs an interactive Q&A interview to nail down targets, splits, metrics, and edge cases.',
  },
  {
    cmd: '/teamwork',
    when: 'Large multi-module builds or independent model reviews',
    effect: 'Coordinates autonomous specialist agents working in parallel across the codebase.',
  },
  {
    cmd: '/boost',
    when: 'Hard debugging, subtle data leakage hunts, or architecture reviews',
    effect: 'Engages deeper strategic reasoning, multi-perspective analysis, and rigorous verification.',
  },
  {
    cmd: '/browser',
    when: 'Testing live model dashboards, Streamlit/React UIs, or docs',
    effect: 'Launches the built-in browser subagent to navigate, click, and visually inspect live pages.',
  },
  {
    cmd: '/learn',
    when: 'After fixing a recurring project quirk or data rule',
    effect: 'Persists the learned pattern into workspace customizations for future sessions.',
  },
  {
    cmd: '/compact',
    when: 'Long exploratory modeling sessions',
    effect: 'Summarizes conversation history to free up context window cleanly.',
  },
];

export const SHORTCUTS_CHEATSHEET = [
  { keys: 'Tab', surface: 'Antigravity IDE', action: 'Accept Autocomplete / Supercomplete / Tab-to-Jump' },
  { keys: '⌘ + → / Ctrl + →', surface: 'Antigravity IDE', action: 'Accept suggestion word-by-word' },
  { keys: '⌘ + I / Ctrl + I', surface: 'Antigravity IDE', action: 'Invoke Instructive Inline Command on selection or cursor' },
  { keys: '@', surface: 'Antigravity 2.0 & IDE', action: 'Attach files, folders, rules, terminals, or MCP tools as context' },
  { keys: '/', surface: 'Antigravity 2.0 & CLI', action: 'Open Slash Command workflow launcher' },
  { keys: 'agy', surface: 'Terminal', action: 'Launch the Antigravity CLI interactive TUI' },
];

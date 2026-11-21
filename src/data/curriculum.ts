export interface CourseModule {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  duration: string;
  phase: 'Foundation' | 'Workflow' | 'Architecture' | 'Production';
  objectives: string[];
  modelDevFocus: string;
  labTitle: string;
  labSteps: string[];
  starterPrompt: string;
  verificationGate: string;
  deckId: 'deck-1' | 'deck-2';
  slideRange: string;
  videoIds: string[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    code: 'MOD-01',
    title: 'Software 3.0 & The Vibe Coding Shift',
    subtitle: 'From line-by-line syntax to intent-driven model prototyping',
    duration: '45 min',
    phase: 'Foundation',
    objectives: [
      'Distinguish Software 1.0 (explicit logic), 2.0 (learned weights), and 3.0 (natural-language agent programming).',
      'Explain where "vibe coding" accelerates ML exploration vs. where strict mathematical verification is non-negotiable.',
      'Adopt the Generation-Verification Loop as the core mental model for AI-assisted model development.',
    ],
    modelDevFocus:
      'Model developers spend 70% of their time on boilerplate EDA, schema wrangling, and visualization scripts. Vibe coding compresses boilerplate to minutes—freeing cognitive bandwidth for target framing, leakage prevention, and domain validation.',
    labTitle: 'Lab 1: Vibe vs. Verify — Spot the Hidden Data Leakage',
    labSteps: [
      'Prompt Antigravity with a vague one-liner to build a churn classifier on synthetic customer data.',
      'Inspect the generated code and intentionally find subtle risks (random split on temporal data, pre-split scaling).',
      'Re-prompt with a structured specification contract and compare both pipelines side-by-side.',
    ],
    starterPrompt: `Build a reproducible churn prediction experiment in Python using scikit-learn on a synthetic 5,000-row telecom dataset with an event_date column.
Before writing code, propose a Plan covering:
1. Temporal train/val/test split cutoffs (no random split).
2. A Pipeline/ColumnTransformer fitted strictly on training folds.
3. Baseline Logistic Regression vs. HistGradientBoostingClassifier evaluated on ROC-AUC, PR-AUC, and Brier score.`,
    verificationGate:
      'Student can articulate 3 silent failure modes of unverified vibe-coded ML scripts and demonstrate a clean Pipeline split.',
    deckId: 'deck-1',
    slideRange: 'Slides 1–5',
    videoIds: ['karpathy-software-3', 'yc-vibe-coding-future'],
  },
  {
    id: 2,
    code: 'MOD-02',
    title: 'Mastering Gemini Antigravity Surfaces',
    subtitle: 'IDE modalities, Antigravity 2.0 Mission Control, and the agy CLI',
    duration: '60 min',
    phase: 'Foundation',
    objectives: [
      'Navigate the 3 IDE modalities: Passive (Tab/Supercomplete), Instructive (⌘+I inline edits), and Collaborative (Agent + Planning Mode).',
      'Use Antigravity 2.0 effectively: @-mentions, /-slash commands (/plan, /grill-me, /boost), Artifacts, and Terminal Sandbox policies.',
      'Select the right surface (IDE vs. Antigravity 2.0 vs. agy CLI) for exploratory notebooks, multi-file pipelines, and quick refactors.',
    ],
    modelDevFocus:
      'Treat Planning Mode and Markdown Artifacts as your living Model Development Plan—approve the data contract, feature plan, and evaluation metrics *before* the agent writes a single line of training code.',
    labTitle: 'Lab 2: Multi-Modality Tour on a Feature Pipeline',
    labSteps: [
      'Open this training repository in Gemini Antigravity and inspect the workspace tree.',
      'Use /plan to design a reusable feature engineering module with unit tests.',
      'Use ⌘+I (Ctrl+I) on a single function to add vectorized null handling and docstrings, reviewing the inline diff.',
    ],
    starterPrompt: `/plan Create a modular Python feature engineering package under src/features/ for credit risk modeling:
- Debt-to-income ratio with zero-division guard
- Rolling 90-day delinquency count computed strictly with t < prediction_date
- Pytest unit tests verifying leakage safety and NaN handling
Wait for my approval on the plan artifact before creating files.`,
    verificationGate:
      'Plan artifact reviewed and approved first; pytest suite passes inside the Terminal Sandbox.',
    deckId: 'deck-1',
    slideRange: 'Slides 6–9',
    videoIds: ['antigravity-2-james-nocode', 'antigravity-codebasics', 'antigravity-normal-people'],
  },
  {
    id: 3,
    code: 'MOD-03',
    title: 'Spec-First Vibe Coding for Model Development',
    subtitle: 'EDA, baselines, feature iteration, and self-healing test loops',
    duration: '60 min',
    phase: 'Workflow',
    objectives: [
      'Write high-signal modeling prompts specifying data contracts, split boundaries, baselines, and acceptance thresholds.',
      'Leverage Antigravity’s self-healing execution loop to run scripts, diagnose tracebacks, and validate outputs automatically.',
      'Generate automated EDA summaries, calibration curves, and error-slice diagnostics in minutes.',
    ],
    modelDevFocus:
      'Never ask for "the best model." Ask for a transparent baseline leaderboard first, followed by hypothesis-driven feature and challenger iterations backed by statistical evidence.',
    labTitle: 'Lab 3: End-to-End Baseline-to-Challenger Leaderboard',
    labSteps: [
      'Provide a dataset schema (or generate a realistic synthetic credit/churn dataset) and run Phase 1–4 of the ml-vibe-blueprint skill.',
      'Have Antigravity benchmark Logistic Regression, Random Forest, and Gradient Boosting on identical temporal folds.',
      'Require a calibration diagnostic (Brier score + reliability table) and error analysis on top false positives.',
    ],
    starterPrompt: `Use the ml-vibe-blueprint skill in this workspace to build an end-to-end modeling experiment:
- Problem: 90-day customer churn classification
- Must include: automated EDA report, temporal split, Pipeline-wrapped preprocessing, and a 3-model leaderboard (Logistic Regression baseline, Random Forest, HistGradientBoosting)
- Output: results/leaderboard.md + pytest verification ensuring deterministic outputs with seed=42.`,
    verificationGate:
      'Executable leaderboard generated with deterministic seed, baseline beat verified, and zero preprocessing leakage.',
    deckId: 'deck-1',
    slideRange: 'Slides 10–12',
    videoIds: ['antigravity-step-by-step'],
  },
  {
    id: 4,
    code: 'MOD-04',
    title: 'Customizing Antigravity: AGENTS.md, Rules & Skills',
    subtitle: 'Encoding model governance and team best practices directly into Git',
    duration: '60 min',
    phase: 'Architecture',
    objectives: [
      'Understand Antigravity’s customization loading priority (Workspace .agents/ → Global ~/.gemini/config/ → Built-in).',
      'Author hierarchical AGENTS.md / GEMINI.md rules that enforce SR 11-7 style model risk controls automatically.',
      'Build progressive-disclosure SKILL.md runbooks so specialized procedures load on demand without bloating context.',
    ],
    modelDevFocus:
      'Institutional knowledge usually dies in dusty wikis. By encoding leakage checks, split rules, and model card templates in .agents/, every developer—and every AI agent—follows team standards automatically.',
    labTitle: 'Lab 4: Author a Custom Domain Skill for Your Class Project',
    labSteps: [
      'Inspect AGENTS.md and .agents/skills/leakage-auditor/SKILL.md included in this repository.',
      'Create a new skill at .agents/skills/bias-slice-checker/SKILL.md that checks subgroup parity metrics.',
      'Test progressive disclosure by prompting Antigravity to audit an existing model script using your new skill.',
    ],
    starterPrompt: `Create a new Antigravity Skill at .agents/skills/bias-slice-checker/SKILL.md that teaches the agent how to evaluate a binary classifier across user-specified demographic or business cohorts (TPR, FPR, positive prediction rate, and calibration gap). Include a clear YAML frontmatter description so progressive disclosure triggers reliably.`,
    verificationGate:
      'Skill loads cleanly on demand and generates a structured subgroup audit table on a sample model.',
    deckId: 'deck-2',
    slideRange: 'Slides 1–6',
    videoIds: ['antigravity-customizations-guide'],
  },
  {
    id: 5,
    code: 'MOD-05',
    title: 'Multi-Agent Orchestration & MCP Integrations',
    subtitle: 'Parallel subagents, independent challenger reviews, and live data via MCP',
    duration: '75 min',
    phase: 'Architecture',
    objectives: [
      'Design a Coordinator + Specialist Subagent architecture (Data Auditor, Challenger Modeler, Verifier, Documenter).',
      'Use isolated workspaces (inherit vs. share vs. branch) so parallel agents never clobber each other’s experiments.',
      'Connect external systems (BigQuery, GitHub, Vercel, Postgres) safely via Model Context Protocol (MCP) servers.',
    ],
    modelDevFocus:
      'Separate generation from critique! Just as real model risk teams maintain an independent validation function, spawning an adversarial Leakage Auditor subagent dramatically reduces confirmation bias.',
    labTitle: 'Lab 5: Run the 3-Agent Model Validation Swarm',
    labSteps: [
      'Review .agents/workflows/model-review-swarm.md and trace the Coordinator-to-Subagent flow in the Agentic Studio tab.',
      'Run a multi-agent review on your Lab 3 model: one subagent audits leakage, one builds a simpler challenger, one drafts MODEL_CARD.md.',
      'Synthesize the findings into a single Go / Conditional-Go / No-Go governance memo.',
    ],
    starterPrompt: `Act as the Model Review Coordinator following .agents/workflows/model-review-swarm.md.
Spawn parallel subagents to independently review our Lab 3 churn pipeline:
1. Research subagent: run the leakage-auditor skill and report any Critical/High vectors.
2. Challenger subagent: train a regularized spline/logistic challenger on the exact same folds.
3. Documentation subagent: run model-card-generator to draft MODEL_CARD.md.
Synthesize all 3 reports into an executive validation decision.`,
    verificationGate:
      'All three specialist reports produced with zero conflicting edits and synthesized into MODEL_CARD.md.',
    deckId: 'deck-2',
    slideRange: 'Slides 7–10',
    videoIds: ['antigravity-subagents-pro', 'antigravity-mcp-setup'],
  },
  {
    id: 6,
    code: 'MOD-06',
    title: 'Verification, Deployment & Interactive Model Apps',
    subtitle: 'Shipping explainable model portals to GitHub Pages, Vercel, and GCP',
    duration: '75 min',
    phase: 'Production',
    objectives: [
      'Vibe-code an interactive stakeholder web app (what-if simulator, threshold slider, SHAP/feature explorer, Model Card).',
      'Verify the live UI end-to-end using Antigravity’s Browser Subagent and automated build checks.',
      'Deploy cleanly via GitHub Actions (GitHub Pages), Vercel, or Google Cloud Run with a reproducible README and Mermaid architecture diagrams.',
    ],
    modelDevFocus:
      'A model trapped in a local notebook creates zero impact. Antigravity lets model developers ship polished, interactive decision tools and transparent Model Cards in a single class session.',
    labTitle: 'Lab 6 (Capstone): Ship Your Live Model Explorer to GitHub & Vercel',
    labSteps: [
      'Wrap your validated Lab 3 model metrics and interactive threshold/what-if explorer into a clean React or Streamlit web app.',
      'Generate a comprehensive README.md with Mermaid architecture and data-flow diagrams.',
      'Push to your GitHub account, verify the GitHub Actions build, and share your live URL with the class.',
    ],
    starterPrompt: `Build a sleek interactive Model Explorer web app for our validated churn model featuring:
1. Interactive threshold slider showing live Precision, Recall, F1, and estimated retention ROI.
2. Feature importance breakdown and calibration chart.
3. Embedded Model Card tab generated from MODEL_CARD.md.
Add a GitHub Actions workflow to deploy to GitHub Pages and verify the production build locally.`,
    verificationGate:
      'Live HTTPS URL accessible by classmates, zero console/build errors, complete README + Model Card.',
    deckId: 'deck-2',
    slideRange: 'Slides 11–12',
    videoIds: ['antigravity-masterclass-2026'],
  },
];

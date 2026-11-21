export interface ScenarioConfig {
  id: string;
  name: string;
  domain: string;
  target: string;
  splitStrategy: string;
  primaryMetrics: string;
  keyRisk: string;
  baselineModel: string;
  challengerModel: string;
}

export interface PatternConfig {
  id: string;
  name: string;
  badge: string;
  description: string;
  agents: {
    role: string;
    mode: string;
    workspace: string;
    skill: string;
    output: string;
  }[];
}

export interface TraceStep {
  step: number;
  actor: string;
  roleColor: string;
  action: string;
  artifact: string;
  detail: string;
  status: 'pass' | 'caught' | 'info';
}

export const ML_SCENARIOS: ScenarioConfig[] = [
  {
    id: 'credit-risk',
    name: 'Credit Default Scorecard',
    domain: 'Financial Risk (SR 11-7)',
    target: 'default_12m (binary, 4.2% positive)',
    splitStrategy: 'Out-of-Time cutoff: Train ≤ 2024-Q4, Val = 2025-Q1–Q2, Test = 2025-Q3–Q4',
    primaryMetrics: 'ROC-AUC, KS Statistic, Brier Score, PSI Drift',
    keyRisk: 'Post-origination delinquency status leaking into origination features',
    baselineModel: 'WOE + Regularized Logistic Regression',
    challengerModel: 'Monotonic-Constrained LightGBM / HistGradientBoosting',
  },
  {
    id: 'churn',
    name: '90-Day Subscription Churn',
    domain: 'SaaS / Telecom Retention',
    target: 'churn_next_90d (binary, 14% positive)',
    splitStrategy: 'Customer-grouped temporal split (zero account overlap across folds)',
    primaryMetrics: 'PR-AUC, Top-Decile Lift, Calibration ECE, Retention ROI',
    keyRisk: 'Cancellation ticket timestamps leaking future churn events',
    baselineModel: 'L2 Logistic Regression with Pipeline preprocessing',
    challengerModel: 'HistGradientBoosting + CalibratedClassifierCV',
  },
  {
    id: 'forecasting',
    name: 'SKU Demand Forecasting',
    domain: 'Supply Chain & Retail',
    target: 'units_sold_next_28d (continuous, zero-inflated)',
    splitStrategy: 'Expanding-window rolling origin cross-validation (5 cutoffs)',
    primaryMetrics: 'WAPE, Pinball Loss (P50 / P90), Bias %',
    keyRisk: 'Future promotion flags or centered rolling averages creating lookahead bias',
    baselineModel: 'Seasonal Naive + Ridge Regression on lag features',
    challengerModel: 'Quantile Gradient Boosting Regressor',
  },
  {
    id: 'fraud',
    name: 'Real-Time Transaction Fraud',
    domain: 'Payments Security',
    target: 'is_fraud (binary, 0.35% positive)',
    splitStrategy: 'Strict chronological split + 14-day label-maturity buffer',
    primaryMetrics: 'PR-AUC, Recall @ 0.5% FPR, P99 Inference Latency (< 25ms)',
    keyRisk: 'Chargeback dispute count accidentally included as an input feature',
    baselineModel: 'Class-weighted Logistic Regression + velocity ratios',
    challengerModel: 'Depth-capped XGBoost / HistGradientBoosting',
  },
];

export const AGENTIC_PATTERNS: PatternConfig[] = [
  {
    id: 'swarm-review',
    name: '4-Agent Validation Swarm',
    badge: 'Recommended for Regulated ML',
    description:
      'Coordinator fans out independent Leakage Auditor, Challenger Modeler, and Model Card Writer subagents in parallel before synthesizing a Go/No-Go decision.',
    agents: [
      {
        role: 'Coordinator',
        mode: 'Main Agent (/plan)',
        workspace: 'inherit',
        skill: 'ml-vibe-blueprint',
        output: 'plan.md + Go/No-Go Synthesis',
      },
      {
        role: 'Data & Leakage Auditor',
        mode: 'Subagent (research)',
        workspace: 'inherit',
        skill: 'leakage-auditor',
        output: 'leakage_audit_report.md',
      },
      {
        role: 'Challenger Modeler',
        mode: 'Subagent (self)',
        workspace: 'share',
        skill: 'ml-vibe-blueprint',
        output: 'results/leaderboard.md',
      },
      {
        role: 'Model Card & UI Verifier',
        mode: 'Subagent (self + browser)',
        workspace: 'inherit',
        skill: 'model-card-generator',
        output: 'MODEL_CARD.md + Live UI Check',
      },
    ],
  },
  {
    id: 'spec-loop',
    name: 'Spec-First Single Agent Loop',
    badge: 'Fast Classroom Prototyping',
    description:
      'Single collaborative agent operating in Planning Mode with AGENTS.md rules, self-healing pytest execution inside the Terminal Sandbox, and artifact review.',
    agents: [
      {
        role: 'Lead Model Agent',
        mode: 'Antigravity Agent + /plan',
        workspace: 'inherit',
        skill: 'ml-vibe-blueprint',
        output: 'Approved Plan → Pipeline → pytest → Leaderboard',
      },
      {
        role: 'Browser Verifier',
        mode: 'Subagent (browser)',
        workspace: 'inherit',
        skill: 'verification',
        output: 'Live Dashboard Screenshot & DOM Check',
      },
    ],
  },
  {
    id: 'mcp-connected',
    name: 'MCP Data-to-Deploy Pipeline',
    badge: 'Cloud & Warehouse Native',
    description:
      'Agent queries live schema metadata via BigQuery/Postgres MCP, enforces read-only profiling, trains models, and ships an interactive portal via GitHub + Vercel MCP.',
    agents: [
      {
        role: 'Data Discovery Agent',
        mode: 'Main Agent + BigQuery MCP',
        workspace: 'inherit',
        skill: 'discovering-gcp-data-assets',
        output: 'Schema Contract & Freshness Report',
      },
      {
        role: 'Modeling & Audit Agent',
        mode: 'Subagent (self)',
        workspace: 'share',
        skill: 'leakage-auditor',
        output: 'Validated Pipeline + MODEL_CARD.md',
      },
      {
        role: 'Deployment Agent',
        mode: 'Main Agent + Vercel/GitHub',
        workspace: 'inherit',
        skill: 'deployments-cicd',
        output: 'Live HTTPS Preview & Production URL',
      },
    ],
  },
];

export function buildSimulationTrace(
  scenario: ScenarioConfig,
  pattern: PatternConfig,
  guardrails: {
    agentsMd: boolean;
    sandbox: boolean;
    leakageAudit: boolean;
    browserCheck: boolean;
  }
): TraceStep[] {
  const steps: TraceStep[] = [
    {
      step: 1,
      actor: 'Coordinator',
      roleColor: 'text-indigo-300 bg-indigo-500/15 border-indigo-400/30',
      action: 'Loads Workspace Governance & Generates Plan Artifact',
      artifact: 'plan.md',
      detail: `${guardrails.agentsMd ? 'Loaded AGENTS.md & model-validation.md rules. ' : 'Warning: No AGENTS.md loaded — relying solely on prompt constraints. '}Locked split policy: ${scenario.splitStrategy}.`,
      status: guardrails.agentsMd ? 'pass' : 'info',
    },
    {
      step: 2,
      actor: pattern.agents[1]?.role ?? 'Lead Model Agent',
      roleColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/30',
      action: 'Runs Automated EDA & Feature Contract Validation',
      artifact: 'eda_summary.md',
      detail: `Profiled target (${scenario.target}), verified missingness distribution, and validated schema assertions${guardrails.sandbox ? ' inside isolated Terminal Sandbox' : ''}.`,
      status: 'pass',
    },
    {
      step: 3,
      actor: guardrails.leakageAudit ? 'Data & Leakage Auditor' : 'Lead Model Agent',
      roleColor: 'text-amber-300 bg-amber-500/15 border-amber-400/30',
      action: guardrails.leakageAudit
        ? 'Executes `leakage-auditor` Skill Across Candidate Features'
        : 'Proceeds Directly to Training (Leakage Audit Skipped)',
      artifact: guardrails.leakageAudit ? 'leakage_audit_report.md' : 'train.py',
      detail: guardrails.leakageAudit
        ? `CAUGHT CRITICAL RISK: Flagged potential leakage vector ("${scenario.keyRisk}") and enforced strict sklearn Pipeline fit on train fold only.`
        : `Risk unmitigated: "${scenario.keyRisk}" was not independently audited before model training.`,
      status: guardrails.leakageAudit ? 'caught' : 'info',
    },
    {
      step: 4,
      actor: pattern.agents[2]?.role ?? 'Challenger Modeler',
      roleColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30',
      action: 'Benchmarks Baseline vs. Challenger on Identical Folds',
      artifact: 'results/leaderboard.md',
      detail: `Trained ${scenario.baselineModel} vs. ${scenario.challengerModel} (seed=42). Logged ${scenario.primaryMetrics} plus subgroup calibration table.`,
      status: 'pass',
    },
    {
      step: 5,
      actor: guardrails.browserCheck ? 'Model Card & Browser Verifier' : 'Documentation Agent',
      roleColor: 'text-violet-300 bg-violet-500/15 border-violet-400/30',
      action: guardrails.browserCheck
        ? 'Generates MODEL_CARD.md & Verifies Interactive Dashboard Live'
        : 'Generates MODEL_CARD.md & Static Build Check',
      artifact: 'MODEL_CARD.md',
      detail: guardrails.browserCheck
        ? 'Compiled SR 11-7 style Model Card, passed pytest determinism suite, and verified live threshold UI via Browser Subagent before GitHub/Vercel deploy.'
        : 'Compiled MODEL_CARD.md and passed pytest determinism suite. Ready for push to GitHub.',
      status: 'pass',
    },
  ];
  return steps;
}

export function generateAntigravityPrompt(
  scenario: ScenarioConfig,
  pattern: PatternConfig,
  guardrails: {
    agentsMd: boolean;
    sandbox: boolean;
    leakageAudit: boolean;
    browserCheck: boolean;
  }
): string {
  return `/plan Build and validate a ${scenario.name} (${scenario.domain}) using the "${pattern.name}" architecture.

1. MODELING CONTRACT
   - Target: ${scenario.target}
   - Split Strategy: ${scenario.splitStrategy}
   - Primary Metrics: ${scenario.primaryMetrics}
   - Baseline: ${scenario.baselineModel}
   - Challenger: ${scenario.challengerModel}

2. AGENTIC ARCHITECTURE & GUARDRAILS
   - ${guardrails.agentsMd ? 'Enforce all rules in AGENTS.md and .agents/rules/model-validation.md.' : 'Wrap all preprocessing inside sklearn Pipeline (fit on train fold only).'}
   - ${guardrails.leakageAudit ? `Invoke the leakage-auditor skill specifically checking for: ${scenario.keyRisk}.` : 'Perform a basic split-overlap sanity check.'}
   - ${guardrails.sandbox ? 'Execute training and pytest determinism tests (seed=42) inside the Terminal Sandbox.' : 'Run pytest determinism tests with seed=42.'}
   - Invoke model-card-generator to produce MODEL_CARD.md.
   - ${guardrails.browserCheck ? 'Build an interactive threshold & explainability explorer UI and verify it live using the Browser Subagent.' : 'Output results/leaderboard.md and prepare for GitHub Pages / Vercel deployment.'}

Wait for my approval on the Plan Artifact before writing code.`;
}

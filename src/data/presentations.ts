export type SlideLayout =
  | 'hero'
  | 'bullets'
  | 'split'
  | 'pillars'
  | 'code'
  | 'table'
  | 'steps';

export interface Slide {
  number: number;
  tag: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bullets?: { label: string; detail: string }[];
  leftTitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightItems?: string[];
  pillars?: { title: string; badge: string; body: string }[];
  codeTitle?: string;
  codeBlock?: string;
  codeNote?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  steps?: { step: string; title: string; detail: string }[];
  callout?: string;
  speakerNotes: string;
}

export interface PresentationDeck {
  id: 'deck-1' | 'deck-2';
  title: string;
  subtitle: string;
  audience: string;
  duration: string;
  moduleRange: string;
  accent: string;
  slides: Slide[];
}

export const PRESENTATION_DECKS: PresentationDeck[] = [
  {
    id: 'deck-1',
    title: 'From Vibe Coding to Agentic Model Development',
    subtitle: 'Teaching Modern ML Prototyping & Verification with Gemini Antigravity',
    audience: 'Model Development & Data Science Students (Modules 1–3)',
    duration: '60–75 min Lecture + Live Demo',
    moduleRange: 'Modules 1–3',
    accent: 'from-indigo-500 to-cyan-400',
    slides: [
      {
        number: 1,
        tag: 'DECK 01 · LECTURE',
        title: 'From Vibe Coding to Agentic Model Development',
        subtitle: 'Building Faster — Without Sacrificing Statistical Rigor — Using Gemini Antigravity',
        layout: 'hero',
        callout: 'Core Thesis: Vibe coding compresses boilerplate to minutes. Model developers win by mastering specification, leakage prevention, and verification.',
        speakerNotes:
          'Welcome the class. Frame today’s session: AI coding agents are not replacing model developers—they are shifting our center of gravity from writing repetitive pandas/matplotlib syntax to acting as chief model architects and validators.',
      },
      {
        number: 2,
        tag: 'THE PARADIGM SHIFT',
        title: 'Software 1.0 → 2.0 → 3.0',
        subtitle: 'Andrej Karpathy’s framework for how software & ML engineering are evolving',
        layout: 'pillars',
        pillars: [
          {
            badge: 'Software 1.0',
            title: 'Explicit Code',
            body: 'Humans write deterministic instructions line-by-line (Python, SQL, C++). Every branch and transformation is hand-authored.',
          },
          {
            badge: 'Software 2.0',
            title: 'Learned Weights',
            body: 'Humans curate datasets and loss functions; optimization discovers the program inside model parameters (GBDTs, Neural Nets).',
          },
          {
            badge: 'Software 3.0',
            title: 'Natural-Language Agents',
            body: 'LLMs act as programmable computers directed in English. Humans specify intent, constraints, and verification gates.',
          },
        ],
        callout: 'In Model Development, we now use Software 3.0 agents (Gemini Antigravity) to build, audit, and deploy Software 2.0 models!',
        speakerNotes:
          'Reference Karpathy’s Y Combinator keynote ("Software Is Changing (Again)", linked in the Video Library). Ask students how much of their last modeling assignment was math vs. wrangling/plotting boilerplate.',
      },
      {
        number: 3,
        tag: 'VIBE CODING DEFINED',
        title: 'Casual Vibe Coding vs. Agentic Model Engineering',
        subtitle: 'Why "accept all diffs blindly" fails in data science — and what replaces it',
        layout: 'split',
        leftTitle: 'Casual Vibe Coding (Dangerous for ML)',
        leftItems: [
          'Vague one-line prompts ("build me the best churn model")',
          'Blindly accepting generated notebooks without checking splits',
          'Pre-split scaling or random splits on time-series data',
          'No baseline benchmark, no calibration check, no fixed seeds',
          'Impressive demo metrics that collapse in production',
        ],
        rightTitle: 'Agentic Model Engineering (Our Standard)',
        rightItems: [
          'Spec-first prompts with explicit data & split contracts',
          'Reviewing the agent’s Plan Artifact before code generation',
          'Pipeline-wrapped preprocessing enforced via AGENTS.md rules',
          'Mandatory simple baseline + challenger leaderboard',
          'Automated pytest determinism & leakage verification gates',
        ],
        speakerNotes:
          'This contrast is the single most important takeaway of the course. Emphasize that statistical bugs rarely throw Python syntax errors—they silently inflate AUC.',
      },
      {
        number: 4,
        tag: 'THE CORE LOOP',
        title: 'The Generation–Verification Loop',
        subtitle: 'How top modelers supervise Gemini Antigravity',
        layout: 'steps',
        steps: [
          {
            step: '01',
            title: 'Specify Intent & Constraints',
            detail: 'Define target, prediction horizon, split boundaries, metrics, and hard guardrails.',
          },
          {
            step: '02',
            title: 'Review Plan Artifact',
            detail: 'Inspect Antigravity’s proposed architecture and catch split/leakage flaws before coding.',
          },
          {
            step: '03',
            title: 'Autonomous Generation & Execution',
            detail: 'Agent writes modular pipelines, runs experiments in the Terminal Sandbox, and self-heals errors.',
          },
          {
            step: '04',
            title: 'Deterministic Verification',
            detail: 'Run pytest checks, leakage audits, calibration diagnostics, and live browser checks.',
          },
        ],
        callout: 'Rule of Thumb: Shorten the feedback loop so the agent can test its own work against objective assertions.',
        speakerNotes:
          'Highlight that Antigravity can execute terminal commands, inspect tracebacks, and fix its own bugs—which means giving it unit tests and schema checks turns it into a self-verifying collaborator.',
      },
      {
        number: 5,
        tag: 'MEET GEMINI ANTIGRAVITY',
        title: 'Three Surfaces, One Agentic Platform',
        subtitle: 'Choosing the right Antigravity surface for every stage of model development',
        layout: 'pillars',
        pillars: [
          {
            badge: 'Antigravity IDE',
            title: 'In-Editor Precision',
            body: 'AI-first IDE built on VS Code. Tab autocomplete, ⌘+I inline diffs, code lenses, and Sidebar Agent Mode.',
          },
          {
            badge: 'Antigravity 2.0',
            title: 'Agent Mission Control',
            body: 'Parallel desktop workspace for orchestrating agents, @-mentions, /-slash commands, Artifacts, Subagents, and Scheduled Tasks.',
          },
          {
            badge: 'Antigravity CLI (agy)',
            title: 'Terminal Speed',
            body: 'Lightweight TUI launched via `agy` for rapid scripting, remote servers, git operations, and quick audits.',
          },
        ],
        speakerNotes:
          'Clarify that Antigravity IDE and Antigravity 2.0 share the exact same customization system (.agents/, AGENTS.md, Skills, MCP). Students can start in whichever surface fits their project.',
      },
      {
        number: 6,
        tag: 'IDE MODALITIES',
        title: 'The 3 AI Modalities Inside Antigravity IDE',
        subtitle: 'Match the modality to the scope of your modeling edit',
        layout: 'table',
        tableHeaders: ['Modality', 'Trigger', 'Scope', 'Best ML Use Case'],
        tableRows: [
          ['Passive (Tab / Supercomplete)', 'Tab / ⌘+→', 'Line or block at cursor', 'Writing repetitive feature transforms, imports, and docstrings'],
          ['Instructive (Inline Command)', '⌘+I / Ctrl+I', 'Highlighted function/block', 'Vectorizing a slow pandas loop or adding NaN safety guards'],
          ['Collaborative (Agent + Plan)', 'Sidebar / /plan', 'Multi-file workspace + CLI', 'Full EDA, train/eval pipelines, unit tests, and web apps'],
        ],
        callout: 'Don’t use Agent Mode to rename one variable—and don’t use Tab autocomplete to architect a 10-file pipeline.',
        speakerNotes:
          'Demonstrate or point out the cognitive friction saved by matching modality to scope. Mention Visual Diff Overlays and Diagnostic Auto-Fix.',
      },
      {
        number: 7,
        tag: 'POWER USER CONTROLS',
        title: 'Antigravity 2.0: @ Mentions, Slash Commands & Sandbox',
        subtitle: 'Precision context injection + safe execution boundaries',
        layout: 'bullets',
        bullets: [
          {
            label: '@ Mentions (Targeted Context)',
            detail: 'Pin exact datasets, scripts, previous conversations, terminal sessions, rules, or MCP tools directly into your prompt.',
          },
          {
            label: 'Slash Commands (/plan, /grill-me, /boost)',
            detail: 'Use /plan for step-by-step plans, /grill-me to interview and stress-test your modeling design, and /teamwork for multi-agent builds.',
          },
          {
            label: 'Artifacts (Reviewable Deliverables)',
            detail: 'Structured Markdown plans, experiment logs, and verification walkthroughs that let you approve designs before execution.',
          },
          {
            label: 'Terminal Sandbox & Permissions',
            detail: 'Isolated execution environment protecting host files and network access—essential when running exploratory ML scripts.',
          },
        ],
        speakerNotes:
          'Encourage students to try `/grill-me` before starting their capstone project—it forces them to clarify target leakage, evaluation metrics, and deployment goals upfront.',
      },
      {
        number: 8,
        tag: 'PROMPT ENGINEERING FOR ML',
        title: 'Anatomy of a High-Signal Model Dev Prompt',
        subtitle: 'Replace ambiguous requests with an executable modeling contract',
        layout: 'code',
        codeTitle: 'High-Signal Antigravity Modeling Prompt',
        codeBlock: `/plan Build a 90-day customer churn pipeline in src/modeling/:

1. DATA CONTRACT:
   - Input: data/telecom_churn.csv (unit: customer_month, timestamp: snapshot_date)
   - Target: churn_next_90d (binary, ~14% positive rate)

2. SPLIT & LEAKAGE POLICY:
   - Strict temporal split: Train <= 2025-06, Val = 2025-07..09, Test >= 2025-10
   - Fit ALL imputers/scalers/encoders inside sklearn Pipeline on Train only

3. BENCHMARKING:
   - Baseline: Regularized LogisticRegression
   - Challengers: HistGradientBoostingClassifier, RandomForestClassifier
   - Report ROC-AUC, PR-AUC, Brier Score, and top-decile lift in results/leaderboard.md

4. VERIFICATION:
   - Write pytest tests checking determinism (seed=42) and zero date overlap.`,
        codeNote: 'Notice: Zero syntax instructions—100% domain contract, leakage boundaries, and measurable acceptance criteria.',
        speakerNotes:
          'Walk line-by-line through the four blocks: Data Contract, Split Policy, Benchmarking, Verification. This template works across credit risk, forecasting, NLP, and vision.',
      },
      {
        number: 9,
        tag: 'SILENT FAILURE MODES',
        title: '5 Vibe-Coding Traps Every Model Developer Must Catch',
        subtitle: 'What passes `python train.py` with exit code 0 — yet invalidates your model',
        layout: 'table',
        tableHeaders: ['Trap', 'How It Happens', 'Antigravity Guardrail'],
        tableRows: [
          ['Pre-Split Preprocessing', 'Agent fits StandardScaler or fillna(mean) on full df', 'Enforce sklearn Pipeline in AGENTS.md'],
          ['Temporal Leakage', 'Random train_test_split on time-indexed records', 'Require explicit cutoff dates + date-overlap pytest'],
          ['Post-Outcome Proxies', 'Using features recorded after the target event', 'Run leakage-auditor skill + univariate AUC > 0.95 alert'],
          ['Metric Tunnel Vision', 'Optimizing accuracy on 2% fraud class', 'Mandate PR-AUC, Brier calibration, and cost-weighted threshold'],
          ['Unreproducible Runs', 'Missing random seeds or floating library versions', 'Pin seed=42 + verify identical scores across 2 runs'],
        ],
        speakerNotes:
          'Ask students if they have ever been bitten by #1 or #2 in a Kaggle competition or internship. Show how easy it is to automate detection with rules and skills.',
      },
      {
        number: 10,
        tag: 'SELF-HEALING WORKFLOW',
        title: 'Closing the Loop with Automated Tests & Browser Checks',
        subtitle: 'Turning Gemini Antigravity into a self-verifying engineering partner',
        layout: 'split',
        leftTitle: 'Backend / Modeling Verification',
        leftItems: [
          'Schema assertions (Pandera / Pydantic / pytest)',
          'Train/val/test disjoint entity & timestamp tests',
          'Determinism test: two runs produce identical predictions',
          'Inference latency & NaN robustness smoke tests',
          'Baseline-beat threshold gate in CI',
        ],
        rightTitle: 'Frontend / Stakeholder App Verification',
        rightItems: [
          'TypeScript compile (`tsc -b`) + production bundle build',
          'Antigravity Browser Subagent clicks sliders & forms live',
          'Visual screenshot inspection of charts & Model Card',
          'Zero console errors or broken links verified',
          'Automated GitHub Actions deploy to Pages / Vercel',
        ],
        speakerNotes:
          'Highlight Antigravity’s Browser Subagent: students can ask Antigravity to open their local Streamlit or React model dashboard, move the risk threshold slider, and verify the live UI works.',
      },
      {
        number: 11,
        tag: 'LIVE CLASS DEMO',
        title: 'In-Class Live Demo Blueprint (15 Minutes)',
        subtitle: 'Watch the complete Vibe-to-Verified cycle happen live',
        layout: 'steps',
        steps: [
          {
            step: 'Min 0–3',
            title: 'Open Repo & Trigger /plan',
            detail: 'Show AGENTS.md in the workspace and paste the Lab 3 churn specification.',
          },
          {
            step: 'Min 3–7',
            title: 'Approve Plan & Run Baseline',
            detail: 'Critique the plan live with class input, then let Antigravity build & execute the baseline.',
          },
          {
            step: 'Min 7–11',
            title: 'Inject Intentional Bug & Audit',
            detail: 'Ask a student to suggest a leaky feature; watch the leakage-auditor skill catch it.',
          },
          {
            step: 'Min 11–15',
            title: 'Generate Leaderboard & Interactive Preview',
            detail: 'Inspect results/leaderboard.md and preview the stakeholder threshold simulator.',
          },
        ],
        speakerNotes:
          'Keep the demo interactive—let students choose the challenger model or threshold cost ratio so they see real-time steering.',
      },
      {
        number: 12,
        tag: 'KEY TAKEAWAYS',
        title: 'Deck 01 Takeaways & Next Lab',
        subtitle: 'Ready to move from individual vibe coding to team-scale agentic architectures',
        layout: 'bullets',
        bullets: [
          {
            label: 'Lead with Contracts, Not Syntax',
            detail: 'Your clarity on target definition, split boundaries, and evaluation metrics determines agent quality.',
          },
          {
            label: 'Always Plan Before Generating',
            detail: 'Catching a temporal split error in a 10-line Plan Artifact beats debugging 400 lines of code.',
          },
          {
            label: 'Verify Mathematically & Automatically',
            detail: 'Pair every vibe-coded pipeline with deterministic pytest checks and calibration reports.',
          },
          {
            label: 'Up Next (Deck 02)',
            detail: 'Scaling this workflow across an entire ML team with AGENTS.md, Skills, Subagents, and MCP.',
          },
        ],
        speakerNotes:
          'Transition to Labs 1–3 or take a 10-minute break before Deck 02. Point students to the Curriculum tab to copy the starter prompts.',
      },
    ],
  },
  {
    id: 'deck-2',
    title: 'Agentic Architectures for ML Teams',
    subtitle: 'Rules, Progressive-Disclosure Skills, Multi-Agent Swarms & MCP in Gemini Antigravity',
    audience: 'Intermediate / Advanced Model Developers (Modules 4–6)',
    duration: '60–75 min Architecture Workshop',
    moduleRange: 'Modules 4–6',
    accent: 'from-emerald-400 to-cyan-400',
    slides: [
      {
        number: 1,
        tag: 'DECK 02 · ARCHITECTURE',
        title: 'Designing Agentic Architectures for ML Teams',
        subtitle: 'Encoding Governance, Modular Skills, Parallel Subagents & MCP Integrations',
        layout: 'hero',
        callout: 'Institutionalizing Excellence: Turn your best model validation checklists into executable, version-controlled agent architecture.',
        speakerNotes:
          'In Deck 01 we mastered single-developer vibe coding. Deck 02 shows how to architect an entire repository so every student or teammate gets automated governance, specialized skills, and multi-agent review.',
      },
      {
        number: 2,
        tag: 'CUSTOMIZATION STACK',
        title: 'The 5 Pillars of Antigravity Customization',
        subtitle: 'Choosing the right abstraction for every team standard',
        layout: 'table',
        tableHeaders: ['Primitive', 'Location', 'Loading Behavior', 'ML Team Use Case'],
        tableRows: [
          ['Rules', 'AGENTS.md / .agents/rules/', 'Always-on or model-triggered', 'Split hygiene, seed determinism, SR 11-7 policies'],
          ['Skills', '.agents/skills/<name>/SKILL.md', 'Progressive disclosure (on-demand)', 'EDA runbook, Leakage Auditor, Model Card generator'],
          ['Plugins', 'plugins/<name>/plugin.json', 'Installable bundle', 'Sharing org-wide skills + MCP servers across teams'],
          ['Hooks', 'hooks.json', 'Lifecycle events', 'Running pre-commit linters or PII scanners automatically'],
          ['MCP Servers', 'mcp_config.json', 'External tool protocol', 'Live read/write access to BigQuery, GitHub, Vercel, Postgres'],
        ],
        speakerNotes:
          'Stress the distinction between Rules (constraints/guardrails) and Skills (step-by-step procedural runbooks).',
      },
      {
        number: 3,
        tag: 'PROGRESSIVE DISCLOSURE',
        title: 'Why Progressive Disclosure Matters for Context Windows',
        subtitle: 'High-precision instructions without drowning the model in noise',
        layout: 'split',
        leftTitle: 'The Anti-Pattern: Mega-Prompt Stuffing',
        leftItems: [
          'Dumping 15 pages of SOPs into one giant system prompt',
          'Wastes context tokens and degrades attention on core tasks',
          'Irrelevant rules (e.g., deployment docs during EDA) add noise',
          'Hard to maintain, review, or version independently',
        ],
        rightTitle: 'Antigravity Progressive Disclosure',
        rightItems: [
          'Only skill names + concise YAML descriptions load at startup',
          'Full SKILL.md instructions load ONLY when the task matches',
          'Rules deduplicate cleanly as the agent walks up the repo tree',
          'Workspace .agents/ overrides global ~/.gemini/config/ cleanly',
        ],
        callout: 'Loading Priority: 1. Workspace .agents/ → 2. Declared JSON → 3. Global ~/.gemini/config/ → 4. Built-in Skills',
        speakerNotes:
          'Show students our actual `.agents/skills/` folder in the Repo Kit tab so they can see how concise YAML frontmatter enables reliable activation.',
      },
      {
        number: 4,
        tag: 'GOVERNANCE AS CODE',
        title: 'Writing a Bulletproof `AGENTS.md` for Model Risk',
        subtitle: 'Checked into Git so every clone inherits your class or enterprise standards',
        layout: 'code',
        codeTitle: 'AGENTS.md (Excerpt from This Training Repo)',
        codeBlock: `# AGENTS.md — Model Development Governance Rules

## 1. Split Hygiene & Zero Leakage (Non-Negotiable)
- Split BEFORE preprocessing: wrap scalers/imputers/encoders inside sklearn Pipeline.
- Default to chronological / expanding-window splits for time-indexed datasets.
- Audit features for post-outcome proxies and univariate AUC > 0.95.

## 2. Baseline First, Complexity Second
- Build an interpretable baseline (Logistic/Ridge) before tuning GBDTs or neural nets.
- Report discrimination (ROC-AUC, PR-AUC), calibration (Brier), and slice stability.

## 3. Verification Over Vibes
- Never present unexecuted code as verified. Run pytest + smoke tests after edits.`,
        codeNote: 'Because AGENTS.md lives in Git, instructor updates propagate to every student on `git pull`.',
        speakerNotes:
          'Highlight how closely this mirrors real banking/healthcare Model Risk Management (SR 11-7) — except now the standards are actively enforced at coding time, not 6 weeks later in review.',
      },
      {
        number: 5,
        tag: 'MODULAR SKILLS',
        title: 'Designing Domain Skills (`SKILL.md`)',
        subtitle: 'Three high-leverage skills included in this repository',
        layout: 'pillars',
        pillars: [
          {
            badge: 'Skill 01',
            title: 'ml-vibe-blueprint',
            body: 'Structured 5-phase modeling workflow: Contract Spec → EDA Audit → Baseline Pipeline → Challenger Iteration → Verification.',
          },
          {
            badge: 'Skill 02',
            title: 'leakage-auditor',
            body: 'Inspects 5 leakage vectors (preprocessing, lookahead, entity overlap, proxies, target encoding) and outputs a Severity audit table.',
          },
          {
            badge: 'Skill 03',
            title: 'model-card-generator',
            body: 'Produces a stakeholder-ready MODEL_CARD.md covering intended use, cutoffs, slice performance, drift metrics, and fallbacks.',
          },
        ],
        speakerNotes:
          'Walk through Lab 4: students will write their own 4th skill (`bias-slice-checker`) using the same YAML + Markdown structure.',
      },
      {
        number: 6,
        tag: 'MULTI-AGENT DESIGN',
        title: 'Why Single Agents Suffer from Confirmation Bias',
        subtitle: 'Separating Generation from Independent Critique',
        layout: 'split',
        leftTitle: 'Single-Agent Loop',
        leftItems: [
          'Same conversation context generates and reviews its own code',
          'Tends to rationalize its own split or feature choices',
          'Context fills up quickly during long EDA + modeling + UI work',
          'Serial execution slows down multi-angle validation',
        ],
        rightTitle: 'Multi-Agent Coordinator + Specialists',
        rightItems: [
          'Fresh subagent contexts provide independent second opinions',
          'Adversarial Data Auditor specifically hunts for flaws',
          'Parallel execution runs Challenger + Auditor + Docs simultaneously',
          'Coordinator synthesizes clean artifacts into a Go/No-Go report',
        ],
        callout: 'Mirror real MRM governance: Model Developer Agent ≠ Independent Model Validator Agent!',
        speakerNotes:
          'This is a great conceptual bridge for finance, healthcare, and enterprise ML students who learn about independent model validation.',
      },
      {
        number: 7,
        tag: 'SUBAGENT TOPOLOGY',
        title: 'The 4-Agent Model Validation Swarm',
        subtitle: 'Fan-out parallel specialists, then synthesize at the Coordinator',
        layout: 'steps',
        steps: [
          {
            step: 'COORD',
            title: 'Coordinator Agent (Main Session)',
            detail: 'Owns the modeling contract, spawns parallel subagents, and makes the final Go/No-Go synthesis.',
          },
          {
            step: 'SUB-1',
            title: 'Data & Leakage Auditor (Read-Only Research)',
            detail: 'Runs `leakage-auditor` across splits, joins, and timestamps in an isolated context.',
          },
          {
            step: 'SUB-2',
            title: 'Challenger Modeler (Shared Git Worktree)',
            detail: 'Independently trains a transparent baseline / spline challenger on the exact same folds.',
          },
          {
            step: 'SUB-3',
            title: 'Verifier & Model Card Writer',
            detail: 'Runs `pytest` + Browser Subagent UI checks and drafts `MODEL_CARD.md`.',
          },
        ],
        speakerNotes:
          'Point students to the Agentic Studio tab where they can simulate this exact 4-agent topology step-by-step across 4 different ML use cases!',
      },
      {
        number: 8,
        tag: 'WORKSPACE ISOLATION',
        title: 'Parallel Workspace Modes: Inherit vs. Share vs. Branch',
        subtitle: 'How Antigravity keeps parallel agents from colliding on files',
        layout: 'table',
        tableHeaders: ['Workspace Mode', 'Underlying Mechanism', 'Best Agent Role'],
        tableRows: [
          ['inherit', 'Shares parent working directory directly', 'Read-only auditors, verifiers, research subagents'],
          ['share', 'Lightweight shared-repo worktree (no storage bloat)', 'Parallel authors building independent challengers or UI modules'],
          ['branch', 'Full isolated repository clone', 'High-risk refactors or destructive experiments'],
        ],
        callout: 'Best Practice: Give readers `inherit`, and give concurrent code-writing subagents `share` so diffs merge cleanly.',
        speakerNotes:
          'Explain that `share` works like `git worktree`—each agent can edit and run tests simultaneously without overwriting another agent’s files.',
      },
      {
        number: 9,
        tag: 'MODEL CONTEXT PROTOCOL',
        title: 'Connecting Live Infrastructure with MCP',
        subtitle: 'Standardized tool protocol linking Antigravity to data & cloud hosts',
        layout: 'pillars',
        pillars: [
          {
            badge: 'Data & Warehouse',
            title: 'BigQuery / Postgres / GCS',
            body: 'Inspect live schemas, validate table freshness, profile distributions, and run dry-run cost checks before querying.',
          },
          {
            badge: 'Code & CI/CD',
            title: 'GitHub & Actions',
            body: 'Create branches, open PRs with verification artifacts, trigger automated model tests, and publish GitHub Pages.',
          },
          {
            badge: 'Hosting & Edge',
            title: 'Vercel & Cloud Run',
            body: 'Deploy interactive React/Next.js model portals, manage env vars, inspect runtime logs, and preview every PR URL.',
          },
        ],
        speakerNotes:
          'Mention the principle of least privilege: start with read-only warehouse credentials during EDA and enforce explicit user confirmation before destructive cloud actions.',
      },
      {
        number: 10,
        tag: 'SECURITY & SANDBOXING',
        title: 'Enterprise Guardrails for Classroom & Production ML',
        subtitle: 'Safe boundaries when agents run code and touch data',
        layout: 'bullets',
        bullets: [
          {
            label: 'Terminal Sandbox by Default',
            detail: 'Commands execute inside an isolated workspace boundary without unintended host filesystem or network egress.',
          },
          {
            label: 'Explicit Approval for External Side Effects',
            detail: 'Network calls, cloud mutations, package installs, and irreversible deletes require human sign-off.',
          },
          {
            label: 'PII & Secret Hygiene',
            detail: 'Never commit `.env`, API keys, or raw customer PII to Git. Use synthetic fixtures for classroom repos and Secret Managers in prod.',
          },
          {
            label: 'Auditability via Transcripts & Artifacts',
            detail: 'Every tool call, plan, and verification test leaves an inspectable paper trail for peer review or grading.',
          },
        ],
        speakerNotes:
          'In a university or corporate training setting, emphasize synthetic data fixtures so students never accidentally upload sensitive data to a public GitHub repo.',
      },
      {
        number: 11,
        tag: 'DEPLOYMENT PIPELINE',
        title: 'Shipping Models as Interactive Shareable Web Apps',
        subtitle: 'GitHub → CI Build → GitHub Pages / Vercel / GCP Cloud Run',
        layout: 'code',
        codeTitle: 'Zero-Friction Deployment Options for Class Projects',
        codeBlock: `1. Static Interactive Portals (React / Vite / Model Cards / Calculators)
   git push origin main  ──▶  GitHub Actions  ──▶  GitHub Pages (Free HTTPS)
                         └──▶  Vercel Git Integration (Instant Preview URLs)

2. Live Python Inference APIs & Heavy ML Backends
   FastAPI / Streamlit Container  ──▶  Google Cloud Run (Scale-to-Zero)
   Frontend on Vercel / Pages     ──▶  Calls Cloud Run /predict Endpoint`,
        codeNote: 'This very training site uses Option 1: pushed to GitHub and auto-deployed via GitHub Actions!',
        speakerNotes:
          'Explain how students can host their frontend + Model Card for free on GitHub Pages or Vercel, and optionally back it with a Google Cloud Run container when live Python inference is needed.',
      },
      {
        number: 12,
        tag: 'CAPSTONE LAUNCH',
        title: 'Your Capstone Architecture Challenge',
        subtitle: 'Build, validate, document, and deploy an end-to-end agentic ML project',
        layout: 'bullets',
        bullets: [
          {
            label: '1. Repository Architecture',
            detail: 'Include `AGENTS.md`, at least 1 custom `SKILL.md`, and a comprehensive `README.md` with Mermaid diagrams.',
          },
          {
            label: '2. Validated Model Pipeline',
            detail: 'Reproducible baseline vs. challenger leaderboard, `pytest` leakage tests, and a complete `MODEL_CARD.md`.',
          },
          {
            label: '3. Interactive Stakeholder Web App',
            detail: 'Deploy a live site (GitHub Pages or Vercel) with threshold controls, performance charts, and explainability views.',
          },
          {
            label: '4. 5-Minute Live Walkthrough',
            detail: 'Present your Plan Artifact, one bug caught by your Auditor Subagent, and your live deployed URL.',
          },
        ],
        speakerNotes:
          'Wrap up by directing students to the Agentic Studio tab to prototype their capstone architecture and generate their starter prompt!',
      },
    ],
  },
];

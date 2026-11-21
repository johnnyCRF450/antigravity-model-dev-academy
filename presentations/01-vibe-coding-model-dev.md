---
marp: true
theme: default
paginate: true
---

# From Vibe Coding to Agentic Model Development
### Teaching Modern ML Prototyping & Verification with Gemini Antigravity

- **Deck 01** · Modules 1–3 (60–75 min Lecture + Live Demo)
- **Core Thesis:** Vibe coding compresses boilerplate to minutes. Model developers win by mastering specification, leakage prevention, and verification.

<!--
Speaker Notes: Welcome the class. Frame today's session: AI coding agents shift model developers from writing repetitive pandas/matplotlib syntax to acting as chief model architects and validators.
-->

---

## Software 1.0 → 2.0 → 3.0

1. **Software 1.0 (Explicit Code):** Deterministic instructions written line-by-line (Python, SQL, C++).
2. **Software 2.0 (Learned Weights):** Humans curate datasets & objectives; optimization discovers weights (GBDTs, Neural Nets).
3. **Software 3.0 (Natural-Language Agents):** LLMs programmed in English through intent, constraints, and verification gates.

> In Model Development, we use **Software 3.0 agents** (Gemini Antigravity) to build, audit, and deploy **Software 2.0 models**.

---

## Casual Vibe Coding vs. Agentic Model Engineering

| Casual Vibe Coding (Risky for ML) | Agentic Model Engineering (Our Standard) |
| :--- | :--- |
| Vague one-line prompts | Spec-first prompts with explicit data & split contracts |
| Blindly accepting diffs | Approving Antigravity Plan Artifacts before code generation |
| Pre-split scaling / random time splits | `sklearn.pipeline.Pipeline` enforced via `AGENTS.md` |
| No baseline or calibration check | Mandatory simple baseline + challenger leaderboard |
| Fragile notebook prototypes | Automated `pytest` determinism & leakage verification gates |

---

## The Generation–Verification Loop

1. **Specify Intent & Constraints** — Target, horizon, split boundaries, primary/secondary metrics.
2. **Review Plan Artifact** — Catch temporal split or leakage flaws before a single line of code is written.
3. **Autonomous Generation & Execution** — Agent builds modular code and runs tests inside the Terminal Sandbox.
4. **Deterministic Verification** — Run `pytest`, `leakage-auditor`, calibration diagnostics, and live Browser checks.

---

## Three Surfaces of Gemini Antigravity

- **Antigravity IDE:** Standalone AI-first IDE (VS Code-based) with Tab autocomplete, `⌘+I` inline diffs, code lenses, and Sidebar Agent Mode.
- **Antigravity 2.0:** Parallel desktop Mission Control for orchestrating conversations, `@`-mentions, `/`-slash commands, Artifacts, Subagents, and Scheduled Tasks.
- **Antigravity CLI (`agy`):** Lightweight terminal TUI for rapid scripting, audits, and git operations.

---

## The 3 IDE Modalities

| Modality | Shortcut | Scope | Best ML Use Case |
| :--- | :--- | :--- | :--- |
| Passive (Tab / Supercomplete) | `Tab` / `⌘+→` | Line / cursor block | Repetitive feature transforms, imports, docstrings |
| Instructive (Inline Command) | `⌘+I` / `Ctrl+I` | Highlighted function | Vectorizing pandas loops or adding NaN guards |
| Collaborative (Agent + Plan) | Sidebar / `/plan` | Multi-file workspace | Full EDA, train/eval pipelines, unit tests, web apps |

---

## Antigravity 2.0 Power Controls

- **`@` Mentions:** Pin exact files, datasets, rules, terminals, or MCP tools into context.
- **Slash Commands:** `/plan`, `/grill-me`, `/teamwork`, `/boost`, `/browser`, `/learn`, `/compact`.
- **Artifacts:** Reviewable Markdown plans and verification walkthroughs before execution.
- **Terminal Sandbox:** Isolated execution boundary protecting host files and network egress.

---

## Anatomy of a High-Signal Model Dev Prompt

```text
/plan Build a 90-day customer churn pipeline in src/modeling/:
1. DATA CONTRACT: customer_month grain, snapshot_date timestamp, churn_next_90d target
2. SPLIT POLICY: Strict temporal split (Train <= 2025-06, Val = 2025-07..09, Test >= 2025-10)
   Fit ALL preprocessing inside sklearn Pipeline on Train only.
3. BENCHMARKING: Regularized LogisticRegression baseline vs. HistGradientBoostingClassifier
   Report ROC-AUC, PR-AUC, Brier Score, and top-decile lift in results/leaderboard.md.
4. VERIFICATION: Pytest suite checking seed=42 determinism and zero date overlap.
```

---

## 5 Vibe-Coding Traps Every Model Developer Must Catch

1. **Pre-Split Preprocessing** — Fit scalers/imputers inside `Pipeline` only.
2. **Temporal Leakage** — Enforce chronological cutoffs + overlap tests.
3. **Post-Outcome Proxies** — Audit features with univariate AUC > 0.95.
4. **Metric Tunnel Vision** — Report PR-AUC, Brier calibration, and cost thresholds.
5. **Unreproducible Runs** — Pin `RANDOM_STATE = 42` and test identical runs.

---

## Closing the Loop: Backend & Browser Verification

- **Modeling Verification:** Pandera/Pydantic schema assertions, disjoint split tests, determinism checks, baseline-beat gates.
- **App Verification:** Production build (`tsc -b && vite build`), Antigravity Browser Subagent live clicks & screenshots, zero console errors.

---

## 15-Minute In-Class Live Demo Blueprint

1. **Min 0–3:** Open repo, show `AGENTS.md`, trigger `/plan` on Lab 3 churn spec.
2. **Min 3–7:** Critique plan live with students; approve and execute baseline.
3. **Min 7–11:** Inject an intentional leaky feature; run `leakage-auditor` skill.
4. **Min 11–15:** Inspect `results/leaderboard.md` and preview stakeholder dashboard.

---

## Deck 01 Takeaways

- Lead with **contracts**, not syntax.
- Always **plan** before generating.
- **Verify** mathematically and automatically.
- Next up in **Deck 02**: Scaling to team-wide agentic architectures with `AGENTS.md`, Skills, Subagents, and MCP.

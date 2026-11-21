---
marp: true
theme: default
paginate: true
---

# Designing Agentic Architectures for ML Teams
### Rules, Progressive-Disclosure Skills, Multi-Agent Swarms & MCP in Gemini Antigravity

- **Deck 02** · Modules 4–6 (60–75 min Architecture Workshop)
- **Core Thesis:** Turn your best model validation checklists into executable, version-controlled agent architecture.

---

## The 5 Pillars of Antigravity Customization

| Primitive | Location | Loading Behavior | ML Team Use Case |
| :--- | :--- | :--- | :--- |
| **Rules** | `AGENTS.md` / `.agents/rules/` | Always-on or model-triggered | Split hygiene, seed determinism, SR 11-7 controls |
| **Skills** | `.agents/skills/<name>/SKILL.md` | Progressive disclosure | EDA runbook, Leakage Auditor, Model Card generator |
| **Plugins** | `plugins/<name>/plugin.json` | Installable bundle | Org-wide skills + MCP toolkits |
| **Hooks** | `hooks.json` | Lifecycle events | Pre-commit linters, PII checks |
| **MCP Servers** | `mcp_config.json` | External tool protocol | BigQuery, GitHub, Vercel, Postgres |

---

## Progressive Disclosure & Loading Priority

- **Startup:** Only skill names and concise YAML descriptions are injected into context.
- **On-Demand:** Full `SKILL.md` procedures load only when relevant to the active task.
- **Priority Order:**
  1. Workspace `.agents/` (walking up to repo root)
  2. Declared `skills.json` / `plugins.json`
  3. Global `~/.gemini/config/`
  4. Built-in skills

---

## Governance as Code (`AGENTS.md`)

- Checked directly into Git so every student clone inherits identical standards:
  - Split before preprocessing (`sklearn` `Pipeline`)
  - Chronological cutoffs for time-indexed data
  - Baseline-first leaderboards with calibration metrics
  - Mandatory `pytest` verification and `MODEL_CARD.md`

---

## Three Core Skills Included in This Repository

1. **`ml-vibe-blueprint`** — Structured 5-phase modeling loop (Contract → EDA → Baseline → Iteration → Verification).
2. **`leakage-auditor`** — Audits 5 leakage vectors and outputs a severity-ranked remediation report.
3. **`model-card-generator`** — Produces stakeholder-ready `MODEL_CARD.md` aligned to Mitchell et al. & SR 11-7.

---

## Separating Generation from Independent Critique

- Single-agent sessions suffer from **confirmation bias** when reviewing their own code.
- Mirror real Model Risk Management (MRM):
  - **Model Developer Agent** ≠ **Independent Validator Agent**
- Fresh subagent contexts challenge assumptions without anchoring on earlier reasoning.

---

## The 4-Agent Model Validation Swarm

1. **Coordinator (Main Agent):** Defines modeling contract, dispatches specialists, synthesizes Go/No-Go decision.
2. **Data & Leakage Auditor (`research` subagent, `inherit`):** Runs `leakage-auditor` read-only across splits & timestamps.
3. **Challenger Modeler (`self` subagent, `share`):** Trains independent regularized baseline on identical folds.
4. **Verifier & Documenter (`self` + `browser`):** Executes `pytest`, verifies UI, writes `MODEL_CARD.md`.

---

## Parallel Workspace Modes

| Mode | Mechanism | Best Role |
| :--- | :--- | :--- |
| `inherit` | Parent working directory | Read-only auditors, verifiers, researchers |
| `share` | Shared-repo worktree | Concurrent authors editing/building in parallel |
| `branch` | Full isolated clone | High-risk refactors or destructive experiments |

---

## Connecting Live Infrastructure via MCP

- **Data Warehouses (BigQuery / Postgres):** Schema discovery, freshness checks, dry-run cost estimation.
- **Version Control (GitHub):** Branching, PR artifacts, GitHub Actions CI/CD, GitHub Pages.
- **Hosting (Vercel / Cloud Run):** Instant preview deployments, logs, and production model apps.

---

## Enterprise & Classroom Security Guardrails

- **Terminal Sandbox** on by default.
- **Explicit Human Approval** for network access, cloud writes, and destructive commands.
- **PII & Secret Hygiene:** Use synthetic classroom fixtures; never commit `.env` or raw PII.
- **Full Auditability:** Transcripts, Plan Artifacts, and Verification Walkthroughs create a clear paper trail.

---

## Zero-Friction Deployment Architecture

```text
git push origin main
  ├──▶ GitHub Actions ──▶ GitHub Pages (Free HTTPS Portal)
  ├──▶ Vercel Git Sync ──▶ Instant Preview & Production URLs
  └──▶ Optional FastAPI / Streamlit ──▶ Google Cloud Run (Scale-to-Zero)
```

---

## Capstone Architecture Challenge

1. Repository with `AGENTS.md`, ≥ 1 custom `SKILL.md`, and `README.md` with Mermaid diagrams.
2. Reproducible baseline vs. challenger leaderboard, `pytest` leakage suite, and `MODEL_CARD.md`.
3. Deployed interactive stakeholder web app on GitHub Pages or Vercel.
4. 5-minute live walkthrough of your Plan Artifact, one caught bug, and live URL.

# Multi-Agent Model Review Swarm Playbook

Use this blueprint in **Gemini Antigravity** (via Subagents or `/teamwork`) to run an independent, parallel model review across four specialist agents.

## Agent Roster & Ownership

| Role | Antigravity Mode | Workspace | Responsibility |
| :--- | :--- | :--- | :--- |
| **Coordinator** | Main Agent | `inherit` | Defines spec, assigns parallel work, synthesizes final go/no-go decision |
| **Data & Leakage Auditor** | Subagent (`research`) | `inherit` | Runs `leakage-auditor` skill; inspects splits, joins, and timestamps |
| **Challenger Modeler** | Subagent (`self`) | `share` | Builds an independent simpler baseline + alternative model family on the same fold |
| **Test & UI Verifier** | Subagent (`self` + `browser`) | `inherit` | Runs `pytest` determinism suite and verifies any model dashboard UI |
| **Model Card Writer** | Subagent (`self`) | `inherit` | Runs `model-card-generator` skill and compiles executive summary |

## Trigger Prompt for Students
```text
Act as the Model Review Coordinator. Launch three parallel subagents:
1. A Data & Leakage Auditor using the leakage-auditor skill to inspect our pipeline.
2. A Challenger Modeler to benchmark a regularized baseline against our current GBDT.
3. A Documentation Agent using the model-card-generator skill to draft MODEL_CARD.md.
Synthesize all findings into a single Go / Conditional-Go / No-Go review report.
```

# Agentic Architecture Specification

This document details the agentic architecture implemented inside **Antigravity Model Dev Academy**—both as a **live educational web portal** and as a **clone-ready Gemini Antigravity workspace**.

---

## 1. Dual-Layer System Architecture

The repository serves two complementary roles:
1. **Interactive Classroom Web App (`src/`)**: Deployed via GitHub Pages (and Vercel-ready) so students can browse the 6-module curriculum, follow 2 interactive slide decks, watch 10 verified videos in-app, and simulate multi-agent ML workflows in the **Agentic Studio**.
2. **Executable Antigravity Workspace (`AGENTS.md` + `.agents/`)**: When students clone the repo into **Gemini Antigravity IDE**, **Antigravity 2.0**, or **`agy` CLI**, the workspace automatically loads model governance rules and progressive-disclosure ML skills.

```mermaid
flowchart TD
    subgraph Workspace["Clone-Ready Antigravity Workspace"]
        A["AGENTS.md (Root Governance Rules)"]
        B[".agents/rules/model-validation.md"]
        C[".agents/skills/ml-vibe-blueprint/SKILL.md"]
        D[".agents/skills/leakage-auditor/SKILL.md"]
        E[".agents/skills/model-card-generator/SKILL.md"]
        F[".agents/workflows/model-review-swarm.md"]
    end

    subgraph Runtime["Gemini Antigravity Runtime"]
        COORD["Coordinator Agent (/plan)"]
        SBX["Terminal Sandbox (pytest / build)"]
        BRW["Browser Subagent (Live UI Check)"]
        MCP["MCP Tool Layer (BigQuery / GitHub / Vercel)"]
    end

    subgraph Portal["Deployed Training Portal (React + Vite)"]
        UI1["6-Module Curriculum & Labs"]
        UI2["2 Interactive Slide Decks (24 Slides)"]
        UI3["10 Verified Videos + Discussion Prompts"]
        UI4["Agentic Studio Simulator & Prompt Builder"]
    end

    Workspace --> COORD
    COORD --> SBX
    COORD --> BRW
    COORD --> MCP
    MCP --> Portal
```

---

## 2. Multi-Agent Model Validation Swarm

To mirror institutional **Model Risk Management (SR 11-7)** and eliminate single-agent confirmation bias, the workspace includes a 4-agent parallel review workflow (`.agents/workflows/model-review-swarm.md`):

```mermaid
sequenceDiagram
    actor Student as Model Developer
    participant Coord as Coordinator Agent (/plan)
    participant Audit as Subagent: Leakage Auditor (research)
    participant Chal as Subagent: Challenger Modeler (share ws)
    participant Ver as Subagent: Verifier & Model Card Writer

    Student->>Coord: Submit Modeling Contract (Target, Split, Metrics)
    Coord->>Coord: Load AGENTS.md + ml-vibe-blueprint
    Coord-->>Student: Plan Artifact (plan.md) for Approval
    Student->>Coord: Approve Plan

    par Parallel Specialist Execution
        Coord->>Audit: Inspect splits, joins & feature timestamps
        Audit->>Audit: Activate leakage-auditor SKILL.md
        Audit-->>Coord: leakage_audit_report.md (Severity Table)
    and
        Coord->>Chal: Train baseline vs. challenger on identical folds
        Chal->>Chal: Run sklearn Pipeline + pytest in Terminal Sandbox
        Chal-->>Coord: results/leaderboard.md
    and
        Coord->>Ver: Verify tests, live UI & generate Model Card
        Ver->>Ver: Activate model-card-generator SKILL.md
        Ver-->>Coord: MODEL_CARD.md + Browser Verification
    end

    Coord-->>Student: Go / Conditional-Go / No-Go Validation Synthesis
```

---

## 3. Customization Discovery & Progressive Disclosure

Antigravity avoids saturating the LLM context window by injecting only skill names and concise descriptions at startup, loading the complete `SKILL.md` only when relevant:

```mermaid
flowchart LR
    P1["1. Workspace .agents/ & AGENTS.md\n(Highest Priority — Checked into Git)"] --> M["Deduplicated Active Context"]
    P2["2. Declared skills.json / plugins.json"] --> M
    P3["3. Global ~/.gemini/config/"] --> M
    P4["4. Built-in Antigravity Skills\n(Lowest Priority)"] --> M
    M --> PD{"Task Matches\nSkill YAML Description?"}
    PD -- "Yes" --> LOAD["Load Full SKILL.md Procedure"]
    PD -- "No" --> SKIP["Keep Lightweight Metadata Only"]
```

---

## 4. Workspace Isolation Matrix

| Agent Role | Subagent Type | Workspace Mode | Rationale |
| :--- | :--- | :--- | :--- |
| Coordinator | Main Session | `inherit` | Owns user contract, plan approval, and final synthesis |
| Data & Leakage Auditor | `research` | `inherit` | Read-only inspection; cannot accidentally modify training scripts |
| Challenger Modeler | `self` | `share` | Shared-repo worktree allows concurrent training/testing without file collisions |
| UI & Test Verifier | `self` + `browser` | `inherit` | Runs production build and validates live localhost/deployed views |

---

## 5. CI/CD Deployment Pipeline & Live GCP Cloud Run Architecture

```mermaid
flowchart LR
    DEV["git push origin main\n(johnnyCRF450)"] --> GHP["GitHub Pages (gh-pages)\nLive Classroom Portal"]
    DEV -. "Optional Git Sync" .-> VCL["Vercel\nPreview + Production Hosting"]
    BACKEND["backend/ (FastAPI + scikit-learn)\nDockerfile + build_artifacts.py"] --> CB["Google Cloud Build\nDeterministic Container Build"]
    CB --> GCR["Google Cloud Run (us-central1)\nLive HTTPS Credit Risk API"]
    GHP -- "Live POST /predict & GET /model-info" --> GCR
    VCL -. "Live POST /predict & GET /model-info" .-> GCR
```

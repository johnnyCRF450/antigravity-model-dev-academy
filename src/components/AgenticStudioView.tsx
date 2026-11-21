import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AGENTIC_PATTERNS,
  buildSimulationTrace,
  generateAntigravityPrompt,
  ML_SCENARIOS,
} from '../data/studio';

export const AgenticStudioView: React.FC = () => {
  const [scenarioId, setScenarioId] = useState(ML_SCENARIOS[0].id);
  const [patternId, setPatternId] = useState(AGENTIC_PATTERNS[0].id);
  const [guardrails, setGuardrails] = useState({
    agentsMd: true,
    sandbox: true,
    leakageAudit: true,
    browserCheck: true,
  });
  const [visibleSteps, setVisibleSteps] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const scenario = ML_SCENARIOS.find((s) => s.id === scenarioId) ?? ML_SCENARIOS[0];
  const pattern = AGENTIC_PATTERNS.find((p) => p.id === patternId) ?? AGENTIC_PATTERNS[0];
  const trace = buildSimulationTrace(scenario, pattern, guardrails);
  const generatedPrompt = generateAntigravityPrompt(scenario, pattern, guardrails);

  useEffect(() => {
    if (!isPlaying) return;
    if (visibleSteps >= trace.length) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleSteps((v) => v + 1);
    }, 650);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleSteps, trace.length]);

  const handleRunSimulation = () => {
    setVisibleSteps(1);
    setIsPlaying(true);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-800 pb-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Interactive Multi-Agent Architecture Simulator
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-white">
          Agentic Model Development Studio
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Configure an ML modeling scenario, choose a Gemini Antigravity orchestration pattern, and
          toggle governance guardrails to simulate how subagents collaborate—and generate a
          ready-to-paste Antigravity prompt for class labs.
        </p>
      </div>

      {/* Configuration Controls */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          {/* Scenario Selector */}
          <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              1. Select Model Development Scenario
            </h2>
            <div className="mt-3 grid gap-2.5">
              {ML_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setScenarioId(sc.id)}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    sc.id === scenario.id
                      ? 'border-indigo-400/60 bg-indigo-500/15'
                      : 'border-slate-800 bg-surface-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white">{sc.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {sc.domain}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Target: {sc.target}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Selector */}
          <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              2. Select Antigravity Architecture Pattern
            </h2>
            <div className="mt-3 space-y-2.5">
              {AGENTIC_PATTERNS.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => setPatternId(pat.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${
                    pat.id === pattern.id
                      ? 'border-cyan-400/60 bg-cyan-500/15'
                      : 'border-slate-800 bg-surface-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white">{pat.name}</span>
                    <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                      {pat.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{pat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Guardrails Toggles */}
          <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              3. Toggle Governance Guardrails
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Try toggling off <strong className="text-slate-200">Leakage Auditor</strong> to
              demonstrate what happens during casual vibe coding!
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {(
                [
                  { key: 'agentsMd', label: 'AGENTS.md Rules' },
                  { key: 'sandbox', label: 'Terminal Sandbox' },
                  { key: 'leakageAudit', label: 'Leakage Auditor' },
                  { key: 'browserCheck', label: 'Browser Verifier' },
                ] as const
              ).map((g) => (
                <button
                  key={g.key}
                  onClick={() =>
                    setGuardrails((prev) => ({ ...prev, [g.key]: !prev[g.key] }))
                  }
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                    guardrails[g.key]
                      ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
                      : 'border-slate-800 bg-surface-950/70 text-slate-500'
                  }`}
                >
                  <span>{g.label}</span>
                  <span className="font-mono text-[10px]">
                    {guardrails[g.key] ? 'ON' : 'OFF'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Topology Diagram + Live Execution Trace + Generated Prompt */}
        <div className="space-y-6 lg:col-span-7">
          {/* Dynamic Agent Topology Schematic */}
          <div className="rounded-2xl border border-slate-800 bg-surface-900/85 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-300" />
                <h2 className="text-sm font-bold text-white">
                  Active Agent Topology — {pattern.name}
                </h2>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {pattern.agents.length} Specialist Nodes
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pattern.agents.map((ag, idx) => (
                <div
                  key={ag.role}
                  className="rounded-xl border border-slate-800 bg-surface-950/80 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {idx + 1}. {ag.role}
                    </span>
                    <span className="rounded bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] text-indigo-300">
                      ws: {ag.workspace}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-400">
                    Mode: <span className="text-slate-200">{ag.mode}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    Skill:{' '}
                    <code className="font-mono text-cyan-300">{ag.skill}</code>
                  </div>
                  <div className="mt-2 border-t border-slate-800/80 pt-1.5 text-[11px] text-emerald-300">
                    Artifact → {ag.output}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Execution Trace Simulator */}
          <div className="rounded-2xl border border-slate-800 bg-surface-900/85 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Simulated Execution Trace ({scenario.name})
                </h2>
                <p className="text-xs text-slate-400">
                  Step through how Antigravity coordinates agents, catches leakage, and verifies
                  artifacts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunSimulation}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
                >
                  <Play className="h-3.5 w-3.5" />
                  Replay Trace
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setVisibleSteps(trace.length);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-surface-850 px-3 py-2 text-xs text-slate-300 hover:text-white"
                  title="Show all steps"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  All
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {trace.slice(0, visibleSteps).map((item) => (
                <div
                  key={item.step}
                  className={`rounded-xl border p-3.5 transition ${
                    item.status === 'caught'
                      ? 'border-amber-400/40 bg-amber-500/10'
                      : item.status === 'info'
                      ? 'border-rose-400/35 bg-rose-500/5'
                      : 'border-slate-800 bg-surface-950/70'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${item.roleColor}`}
                      >
                        STEP 0{item.step} · {item.actor}
                      </span>
                      <span className="text-xs font-bold text-white">{item.action}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-300">
                      {item.status === 'caught' ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                      ) : item.status === 'info' ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      {item.artifact}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Copyable Antigravity Prompt */}
          <div className="rounded-2xl border border-indigo-500/30 bg-surface-900/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-300" />
                <h2 className="text-sm font-bold text-white">
                  Tailored Gemini Antigravity Starter Prompt
                </h2>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/30"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-surface-950 p-4 font-mono text-xs leading-relaxed text-indigo-100 whitespace-pre-wrap">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

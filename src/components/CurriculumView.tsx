import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  FlaskConical,
  PlaySquare,
  Presentation,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { COURSE_MODULES } from '../data/curriculum';
import { CURATED_VIDEOS } from '../data/videos';

interface CurriculumViewProps {
  completedIds: number[];
  onToggleComplete: (id: number) => void;
  onOpenDeck: (deckId: 'deck-1' | 'deck-2') => void;
  onWatchVideo: (youtubeId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  completedIds,
  onToggleComplete,
  onOpenDeck,
  onWatchVideo,
}) => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const activeMod = COURSE_MODULES.find((m) => m.id === selectedId) ?? COURSE_MODULES[0];
  const matchedVideos = CURATED_VIDEOS.filter((v) => activeMod.videoIds.includes(v.id));

  const copyPrompt = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Structured Syllabus & Hands-On Labs
          </span>
          <h1 className="mt-1 text-3xl font-extrabold text-white">
            Model Development Training Curriculum
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Six progressive modules taking students from Karpathy’s Software 3.0 mental model to
            multi-agent validation swarms and deployed ML web applications. Progress saves locally
            in your browser.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-surface-900 px-4 py-2.5 text-sm">
          <span className="text-slate-400">Completed: </span>
          <span className="font-mono font-bold text-emerald-300">
            {completedIds.length} / {COURSE_MODULES.length} Modules
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Module Rail */}
        <aside className="space-y-2.5 lg:col-span-4">
          {COURSE_MODULES.map((mod) => {
            const isSelected = mod.id === activeMod.id;
            const isDone = completedIds.includes(mod.id);
            return (
              <div
                key={mod.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                  isSelected
                    ? 'border-indigo-400/60 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-surface-900/70 hover:border-slate-700 hover:bg-surface-850'
                }`}
              >
                <button
                  onClick={() => onToggleComplete(mod.id)}
                  className="mt-0.5 shrink-0 text-slate-400 transition hover:text-emerald-400"
                  title={isDone ? 'Mark incomplete' : 'Mark module complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedId(mod.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-indigo-300">
                      {mod.code} · {mod.duration}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                      {mod.phase}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-white">{mod.title}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{mod.subtitle}</div>
                </button>
              </div>
            );
          })}
        </aside>

        {/* Active Module Detail */}
        <section className="space-y-6 rounded-3xl border border-slate-800 bg-surface-900/80 p-6 sm:p-8 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 font-mono text-xs font-semibold text-indigo-300">
                  {activeMod.code}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                  {activeMod.phase} · {activeMod.duration}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">{activeMod.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{activeMod.subtitle}</p>
            </div>

            <button
              onClick={() => onToggleComplete(activeMod.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                completedIds.includes(activeMod.id)
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completedIds.includes(activeMod.id) ? 'Completed' : 'Mark Complete'}
            </button>
          </div>

          {/* Model Dev Framing */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Why This Matters for Model Developers
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
              {activeMod.modelDevFocus}
            </p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Learning Objectives
            </h3>
            <ul className="mt-3 space-y-2">
              {activeMod.objectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hands-on Lab */}
          <div className="rounded-2xl border border-slate-800 bg-surface-950/70 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <FlaskConical className="h-4 w-4" />
              {activeMod.labTitle}
            </div>
            <ol className="mt-3 space-y-2.5 text-sm text-slate-300">
              {activeMod.labSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-[11px] font-bold text-emerald-300">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            {/* Copyable Starter Prompt */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-indigo-300">
                  Copy-Ready Gemini Antigravity Prompt
                </span>
                <button
                  onClick={() => copyPrompt(activeMod.id, activeMod.starterPrompt)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/30"
                >
                  {copiedId === activeMod.id ? (
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
              <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-800 bg-surface-900 p-4 font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                {activeMod.starterPrompt}
              </pre>
            </div>
          </div>

          {/* Verification Gate */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Verification Gate (Rubric Check)
              </div>
              <p className="mt-1 text-sm text-slate-200">{activeMod.verificationGate}</p>
            </div>
          </div>

          {/* Linked Slides & Videos */}
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-5">
            <button
              onClick={() => onOpenDeck(activeMod.deckId)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-200 ring-1 ring-indigo-400/40 transition hover:bg-indigo-500/30"
            >
              <Presentation className="h-4 w-4" />
              Open {activeMod.deckId === 'deck-1' ? 'Deck 1' : 'Deck 2'} ({activeMod.slideRange})
            </button>
            {matchedVideos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => onWatchVideo(vid.youtubeId)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface-850 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200"
              >
                <PlaySquare className="h-3.5 w-3.5 text-cyan-300" />
                Watch: {vid.author}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

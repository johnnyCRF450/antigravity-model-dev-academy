import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  PlaySquare,
  Presentation,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { COURSE_MODULES } from '../data/curriculum';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenDeck: (deckId: 'deck-1' | 'deck-2') => void;
  completedIds: number[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenDeck,
  completedIds,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-surface-900/90 p-8 shadow-2xl sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-70" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-12 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            MODEL DEVELOPMENT TRAINING PROGRAM · GEMINI ANTIGRAVITY
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Vibe Fast.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Verify Rigorously.
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A complete classroom portal, interactive slide deck suite, curated video curriculum,
            and live agentic architecture studio designed to teach model developers how to build,
            audit, and ship ML systems with{' '}
            <span className="font-semibold text-white">Gemini Antigravity</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('curriculum')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
            >
              Start 6-Module Curriculum
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onOpenDeck('deck-1')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface-850 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:bg-surface-800"
            >
              <Presentation className="h-4 w-4 text-cyan-300" />
              Launch Presentations (2 Decks)
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface-850 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/50 hover:bg-surface-800"
            >
              <Cpu className="h-4 w-4 text-emerald-300" />
              Open Agentic Studio
            </button>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-4">
          {[
            { value: '6 Modules', label: 'Hands-on ML Labs & Prompts' },
            { value: '2 Decks', label: '24 Slides + Speaker Notes' },
            { value: '10 Videos', label: 'Verified YouTube Curriculum' },
            { value: '.agents/ Kit', label: 'Clone-Ready Skills & Rules' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800/90 bg-surface-950/60 p-4"
            >
              <div className="text-xl font-bold text-white sm:text-2xl">{stat.value}</div>
              <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Pillars of the Program */}
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Why Vibe Coding Needs Agentic Engineering in Model Dev
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Statistical bugs rarely throw syntax errors. This course pairs rapid natural-language
              prototyping with institutional-grade guardrails.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-surface-900/70 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Spec-First Prototyping</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Replace vague prompts with executable modeling contracts—locking down target
              definitions, temporal splits, and baseline benchmarks inside Antigravity{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                /plan
              </code>{' '}
              artifacts before generating code.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-surface-900/70 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Governance as Code</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Check{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                AGENTS.md
              </code>{' '}
              and progressive-disclosure{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                SKILL.md
              </code>{' '}
              runbooks into Git so every student automatically inherits zero-leakage and Model Card
              standards.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-surface-900/70 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Independent Multi-Agent Review</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Eliminate confirmation bias by orchestrating parallel subagents—an adversarial Data
              Auditor, a Challenger Modeler, and a Browser Verifier—before deploying to GitHub Pages
              or Vercel.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch Portals */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-surface-900 to-surface-900 p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Presentation className="h-4 w-4" />
              Classroom Slide Decks (Fullscreen + Speaker Notes)
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">Two Ready-to-Teach Presentations</h3>
            <p className="mt-2 text-sm text-slate-300">
              Present directly from this site with arrow-key controls, toggleable instructor notes,
              and print-to-PDF support.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenDeck('deck-1')}
              className="rounded-lg bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-200 ring-1 ring-indigo-400/40 transition hover:bg-indigo-500/30"
            >
              Deck 1: Vibe Coding Foundations (12 Slides) →
            </button>
            <button
              onClick={() => onOpenDeck('deck-2')}
              className="rounded-lg bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/40 transition hover:bg-emerald-500/25"
            >
              Deck 2: Agentic ML Architectures (12 Slides) →
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-surface-900 to-surface-900 p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <PlaySquare className="h-4 w-4" />
              Verified Video Library & Live Studio
            </div>
            <h3 className="mt-2 text-xl font-bold text-white">
              Watch In-App & Simulate Agent Swarms
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Every video link is verified with YouTube embeds and instructor discussion questions.
              Pair videos with the interactive Agentic Studio to test workflows live in class.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('videos')}
              className="rounded-lg bg-cyan-500/20 px-4 py-2 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-400/40 transition hover:bg-cyan-500/30"
            >
              Browse 10 Verified Videos →
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
            >
              Inspect .agents/ Starter Kit →
            </button>
          </div>
        </div>
      </section>

      {/* Course Roadmap Preview */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">6-Module Course Roadmap</h2>
            <p className="mt-1 text-sm text-slate-400">
              Click any module to open its lab guide, copyable Antigravity prompt, and verification
              gate.
            </p>
          </div>
          <button
            onClick={() => onNavigate('curriculum')}
            className="hidden items-center gap-1.5 text-sm font-semibold text-indigo-300 hover:text-indigo-200 sm:inline-flex"
          >
            <BookOpen className="h-4 w-4" />
            View Full Syllabus
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSE_MODULES.map((mod) => {
            const done = completedIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate('curriculum')}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-surface-900/75 p-5 text-left transition hover:border-indigo-400/50 hover:bg-surface-850"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-indigo-300">
                      {mod.code} · {mod.duration}
                    </span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        {mod.phase}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-indigo-200">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{mod.subtitle}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                  <span>{mod.slideRange}</span>
                  <span className="text-indigo-300 group-hover:translate-x-0.5 transition">
                    Open Lab →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

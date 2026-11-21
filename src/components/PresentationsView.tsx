import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageSquareText,
  Minimize2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { PRESENTATION_DECKS, Slide } from '../data/presentations';

interface PresentationsViewProps {
  initialDeckId: 'deck-1' | 'deck-2';
}

const SlideCanvas: React.FC<{ slide: Slide; accent: string }> = ({ slide, accent }) => {
  return (
    <div className="print-slide relative flex min-h-[470px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-surface-900 via-surface-950 to-surface-900 p-7 shadow-2xl sm:min-h-[540px] sm:p-11">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span
            className={`inline-block rounded-full bg-gradient-to-r ${accent} px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-surface-950`}
          >
            {slide.tag}
          </span>
          <span className="font-mono text-xs text-slate-500">
            Slide {String(slide.number).padStart(2, '0')} / 12
          </span>
        </div>

        <h2
          className={`mt-4 font-extrabold tracking-tight text-white ${
            slide.layout === 'hero'
              ? 'text-3xl sm:text-5xl lg:leading-tight'
              : 'text-2xl sm:text-3xl'
          }`}
        >
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">{slide.subtitle}</p>
        )}
      </div>

      {/* Main Content by Layout */}
      <div className="relative z-10 my-6 flex-1">
        {slide.layout === 'hero' && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { k: 'Platform', v: 'Gemini Antigravity (IDE · 2.0 · CLI)' },
              { k: 'Discipline', v: 'Model Development & Validation' },
              { k: 'Standard', v: 'Spec → Plan → Audit → Deploy' },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-2xl border border-slate-800 bg-surface-900/90 p-4"
              >
                <div className="font-mono text-[11px] uppercase text-indigo-300">{item.k}</div>
                <div className="mt-1 text-sm font-semibold text-white">{item.v}</div>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'pillars' && slide.pillars && (
          <div className="grid gap-4 md:grid-cols-3">
            {slide.pillars.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-slate-800 bg-surface-900/85 p-5"
              >
                <span className="w-fit rounded-md bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-300">
                  {p.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'split' && (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300">
                {slide.leftTitle}
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-200">
                {slide.leftItems?.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                {slide.rightTitle}
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-200">
                {slide.rightItems?.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {slide.layout === 'bullets' && slide.bullets && (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {slide.bullets.map((b) => (
              <div
                key={b.label}
                className="rounded-2xl border border-slate-800 bg-surface-900/85 p-4"
              >
                <div className="text-sm font-bold text-cyan-300">{b.label}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{b.detail}</p>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'steps' && slide.steps && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {slide.steps.map((s) => (
              <div
                key={s.step}
                className="flex flex-col rounded-2xl border border-slate-800 bg-surface-900/85 p-4"
              >
                <span className="font-mono text-xs font-bold text-indigo-400">{s.step}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{s.detail}</p>
              </div>
            ))}
          </div>
        )}

        {slide.layout === 'table' && slide.tableHeaders && slide.tableRows && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface-900/90">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-800 bg-surface-850 text-indigo-300">
                <tr>
                  {slide.tableHeaders.map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {slide.tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3 ${ci === 0 ? 'font-semibold text-white' : 'text-slate-300'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {slide.layout === 'code' && slide.codeBlock && (
          <div className="space-y-3">
            {slide.codeTitle && (
              <div className="font-mono text-xs font-semibold text-indigo-300">
                {slide.codeTitle}
              </div>
            )}
            <pre className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface-950 p-5 font-mono text-xs leading-relaxed text-emerald-200 whitespace-pre-wrap sm:text-[13px]">
              {slide.codeBlock}
            </pre>
            {slide.codeNote && <p className="text-xs text-slate-400">{slide.codeNote}</p>}
          </div>
        )}
      </div>

      {/* Footer Callout */}
      {slide.callout && (
        <div className="relative z-10 flex items-center gap-2.5 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-xs font-medium text-indigo-100 sm:text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-300" />
          <span>{slide.callout}</span>
        </div>
      )}
    </div>
  );
};

export const PresentationsView: React.FC<PresentationsViewProps> = ({ initialDeckId }) => {
  const [deckId, setDeckId] = useState<'deck-1' | 'deck-2'>(initialDeckId);
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setDeckId(initialDeckId);
    setSlideIdx(0);
  }, [initialDeckId]);

  const deck = PRESENTATION_DECKS.find((d) => d.id === deckId) ?? PRESENTATION_DECKS[0];
  const currentSlide = deck.slides[slideIdx] ?? deck.slides[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setSlideIdx((prev) => Math.min(deck.slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setSlideIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deck.slides.length, fullscreen]);

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-surface-950 p-6 sm:p-10'
          : 'space-y-6 pb-16'
      }
    >
      {/* Deck Switcher & Controls */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {PRESENTATION_DECKS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDeckId(d.id);
                setSlideIdx(0);
              }}
              className={`rounded-xl px-4 py-2.5 text-left transition ${
                deckId === d.id
                  ? 'bg-indigo-500/20 text-white ring-1 ring-indigo-400/60'
                  : 'border border-slate-800 bg-surface-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold">{d.id === 'deck-1' ? 'Deck 1' : 'Deck 2'}: {d.title}</div>
              <div className="text-[11px] text-slate-400">
                {d.moduleRange} · {d.slides.length} slides · {d.duration}
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              showNotes
                ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                : 'border-slate-700 bg-surface-900 text-slate-300'
            }`}
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            Speaker Notes
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface-900 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
          <button
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface-900 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {fullscreen ? 'Exit' : 'Present'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="no-print h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${deck.accent} transition-all duration-300`}
          style={{ width: `${((slideIdx + 1) / deck.slides.length) * 100}%` }}
        />
      </div>

      {/* Main Slide Canvas */}
      <SlideCanvas slide={currentSlide} accent={deck.accent} />

      {/* Navigation Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSlideIdx((p) => Math.max(0, p - 1))}
            disabled={slideIdx === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-surface-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => setSlideIdx((p) => Math.min(deck.slides.length - 1, p + 1))}
            disabled={slideIdx === deck.slides.length - 1}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-40"
          >
            Next Slide
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="ml-2 hidden font-mono text-xs text-slate-500 sm:inline">
            Tip: Use ← and → arrow keys
          </span>
        </div>

        {/* Slide Index Pills */}
        <div className="flex flex-wrap gap-1.5">
          {deck.slides.map((s, idx) => (
            <button
              key={s.number}
              onClick={() => setSlideIdx(idx)}
              className={`h-8 w-8 rounded-lg font-mono text-xs font-semibold transition ${
                idx === slideIdx
                  ? 'bg-indigo-500 text-white'
                  : 'border border-slate-800 bg-surface-900 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
              title={s.title}
            >
              {s.number}
            </button>
          ))}
        </div>
      </div>

      {/* Instructor Speaker Notes */}
      {showNotes && (
        <div className="no-print rounded-2xl border border-cyan-500/25 bg-surface-900/90 p-5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
            <MessageSquareText className="h-4 w-4" />
            Instructor Speaker Notes — Slide {currentSlide.number}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {currentSlide.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
};

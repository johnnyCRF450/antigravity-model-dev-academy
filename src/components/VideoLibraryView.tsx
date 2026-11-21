import React, { useState } from 'react';
import { ExternalLink, MessageCircleQuestion, Play, X } from 'lucide-react';
import {
  CURATED_VIDEOS,
  OFFICIAL_RESOURCES,
  VideoCategory,
} from '../data/videos';

interface VideoLibraryViewProps {
  activeYoutubeId: string | null;
  onSelectYoutubeId: (id: string | null) => void;
}

const CATEGORIES: VideoCategory[] = [
  'All',
  'Vibe Coding Foundations',
  'Antigravity Getting Started',
  'Rules, Skills & MCP',
  'Subagents & Mastery',
];

export const VideoLibraryView: React.FC<VideoLibraryViewProps> = ({
  activeYoutubeId,
  onSelectYoutubeId,
}) => {
  const [category, setCategory] = useState<VideoCategory>('All');

  const filtered =
    category === 'All'
      ? CURATED_VIDEOS
      : CURATED_VIDEOS.filter((v) => v.category === category);

  const activeVideo = CURATED_VIDEOS.find((v) => v.youtubeId === activeYoutubeId);

  return (
    <div className="space-y-10 pb-16">
      <div className="border-b border-slate-800 pb-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Verified Curated YouTube Curriculum
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-white">
          Video Library & Official Channels
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Every video below has been verified and paired with a classroom discussion prompt. Click{' '}
          <strong className="text-slate-200">Watch In-App</strong> to play directly on a projector
          or open on YouTube.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === cat
                  ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/50'
                  : 'border border-slate-800 bg-surface-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vid) => (
          <article
            key={vid.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-surface-900/80 transition hover:border-cyan-400/40"
          >
            <button
              onClick={() => onSelectYoutubeId(vid.youtubeId)}
              className="relative aspect-video w-full overflow-hidden bg-slate-950"
            >
              <img
                src={vid.thumbnail}
                alt={vid.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/95 text-white shadow-xl transition group-hover:scale-110">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </div>
              </div>
              <span className="absolute left-3 top-3 rounded-md bg-surface-950/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 backdrop-blur">
                MOD-0{vid.recommendedModule} · {vid.level}
              </span>
            </button>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  {vid.author} · {vid.category}
                </div>
                <h3 className="mt-1.5 text-base font-bold leading-snug text-white">
                  {vid.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{vid.summary}</p>

                <div className="mt-4 rounded-xl border border-slate-800 bg-surface-950/70 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <MessageCircleQuestion className="h-3.5 w-3.5" />
                    Class Discussion Prompt
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {vid.discussionPrompt}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => onSelectYoutubeId(vid.youtubeId)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/30"
                >
                  <Play className="h-3.5 w-3.5" />
                  Watch In-App
                </button>
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white"
                >
                  YouTube <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Official Antigravity Channels & Docs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Official Google Antigravity Channels & Documentation
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_RESOURCES.map((res) => (
            <a
              key={res.url}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-surface-900/70 p-5 transition hover:border-indigo-400/50 hover:bg-surface-850"
            >
              <div>
                <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-indigo-300">
                  {res.badge}
                </span>
                <h3 className="mt-2.5 text-sm font-bold text-white group-hover:text-indigo-200">
                  {res.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {res.description}
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
                Open Resource <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Embedded YouTube Player Modal */}
      {activeYoutubeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => onSelectYoutubeId(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-surface-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5">
              <div>
                <div className="text-sm font-bold text-white">
                  {activeVideo?.title ?? 'Video Player'}
                </div>
                {activeVideo && (
                  <div className="text-xs text-slate-400">
                    {activeVideo.author} · Module {activeVideo.recommendedModule}
                  </div>
                )}
              </div>
              <button
                onClick={() => onSelectYoutubeId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                title={activeVideo?.title ?? 'YouTube Video'}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {activeVideo && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-surface-950 px-5 py-3 text-xs text-slate-300">
                <span>
                  <strong className="text-emerald-300">Discussion:</strong>{' '}
                  {activeVideo.discussionPrompt}
                </span>
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 font-semibold text-cyan-300 hover:underline"
                >
                  Open on YouTube <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

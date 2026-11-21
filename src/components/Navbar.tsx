import React from 'react';
import {
  BookOpen,
  Cpu,
  FolderGit2,
  Home,
  PlaySquare,
  Presentation,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'curriculum'
  | 'presentations'
  | 'videos'
  | 'studio'
  | 'resources';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  completedCount: number;
  totalModules: number;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Overview', icon: Home },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
  { id: 'presentations', label: 'Presentations', icon: Presentation },
  { id: 'videos', label: 'Video Library', icon: PlaySquare },
  { id: 'studio', label: 'Agentic Studio', icon: Cpu },
  { id: 'resources', label: 'Repo Kit', icon: FolderGit2 },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  completedCount,
  totalModules,
}) => {
  const pct = Math.round((completedCount / totalModules) * 100);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-800/80 bg-surface-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 text-left transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-surface-950 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white sm:text-base">
                Antigravity Model Dev
              </span>
              <span className="hidden rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 sm:inline-block">
                Training Academy
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vibe Coding & Agentic ML Engineering
            </p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onSelectTab(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/40'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('curriculum')}
            className="hidden items-center gap-2.5 rounded-full border border-slate-700/80 bg-surface-900 px-3 py-1.5 text-xs transition hover:border-indigo-400/40 sm:flex"
            title="View your module completion progress"
          >
            <span className="text-slate-400">Progress</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono font-semibold text-emerald-300">
              {completedCount}/{totalModules}
            </span>
          </button>

          <a
            href="https://github.com/johnnyCRF450/antigravity-model-dev-academy"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-700 bg-surface-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            GitHub Repo ↗
          </a>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Bar */}
      <div className="flex gap-1 overflow-x-auto border-t border-slate-800/70 px-4 py-2 lg:hidden">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onSelectTab(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

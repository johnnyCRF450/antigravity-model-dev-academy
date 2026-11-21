import React, { useState } from 'react';
import { Check, Copy, FileCode2, Keyboard, Terminal } from 'lucide-react';
import {
  REPO_KIT_FILES,
  SHORTCUTS_CHEATSHEET,
  SLASH_COMMANDS_CHEATSHEET,
} from '../data/repoKit';

export const RepoKitView: React.FC = () => {
  const [activePath, setActivePath] = useState(REPO_KIT_FILES[0].path);
  const [copied, setCopied] = useState(false);

  const activeFile =
    REPO_KIT_FILES.find((f) => f.path === activePath) ?? REPO_KIT_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="border-b border-slate-800 pb-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-300">
          Clone-Ready Antigravity Workspace Architecture
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-white">
          Repository Agentic Kit & Cheatsheets
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          When students clone this repository and open it in{' '}
          <strong className="text-white">Gemini Antigravity</strong>, the rules and skills below
          activate automatically via workspace discovery.
        </p>
      </div>

      {/* Interactive .agents/ Explorer */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-2 lg:col-span-4">
          {REPO_KIT_FILES.map((file) => {
            const active = file.path === activeFile.path;
            return (
              <button
                key={file.path}
                onClick={() => setActivePath(file.path)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-indigo-400/60 bg-indigo-500/15'
                    : 'border-slate-800 bg-surface-900/75 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-300">
                    <FileCode2 className="h-3.5 w-3.5" />
                    {file.path}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {file.category}
                  </span>
                </div>
                <div className="mt-1 text-sm font-bold text-white">{file.label}</div>
                <p className="mt-1 text-xs text-slate-400">{file.summary}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col rounded-3xl border border-slate-800 bg-surface-900/90 p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="font-mono text-sm font-bold text-cyan-300">{activeFile.path}</div>
              <p className="mt-0.5 text-xs text-slate-400">{activeFile.summary}</p>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy File
                </>
              )}
            </button>
          </div>
          <pre className="mt-4 flex-1 overflow-x-auto rounded-2xl border border-slate-800 bg-surface-950 p-5 font-mono text-xs leading-relaxed text-emerald-200 whitespace-pre-wrap">
            {activeFile.content}
          </pre>
        </div>
      </section>

      {/* Cheatsheets Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Slash Commands */}
        <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-6">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Terminal className="h-5 w-5 text-indigo-300" />
            Antigravity Slash Commands Cheatsheet
          </div>
          <div className="mt-4 divide-y divide-slate-800/80">
            {SLASH_COMMANDS_CHEATSHEET.map((item) => (
              <div key={item.cmd} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <code className="rounded bg-indigo-500/15 px-2 py-0.5 font-mono text-xs font-bold text-indigo-300">
                    {item.cmd}
                  </code>
                  <span className="text-[11px] text-slate-400">{item.when}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{item.effect}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts & Surfaces */}
        <div className="rounded-2xl border border-slate-800 bg-surface-900/80 p-6">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Keyboard className="h-5 w-5 text-cyan-300" />
            Essential Shortcuts & Triggers
          </div>
          <div className="mt-4 divide-y divide-slate-800/80">
            {SHORTCUTS_CHEATSHEET.map((sc) => (
              <div key={sc.keys} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <kbd className="rounded border border-slate-700 bg-surface-950 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-300">
                    {sc.keys}
                  </kbd>
                  <span className="text-[11px] font-medium text-slate-400">{sc.surface}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{sc.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CurriculumView } from './components/CurriculumView';
import { PresentationsView } from './components/PresentationsView';
import { VideoLibraryView } from './components/VideoLibraryView';
import { AgenticStudioView } from './components/AgenticStudioView';
import { RepoKitView } from './components/RepoKitView';
import { COURSE_MODULES } from './data/curriculum';

const VALID_TABS: NavTab[] = [
  'home',
  'curriculum',
  'presentations',
  'videos',
  'studio',
  'resources',
];

function getTabFromHash(): NavTab {
  const hash = window.location.hash.replace('#', '') as NavTab;
  return VALID_TABS.includes(hash) ? hash : 'home';
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(getTabFromHash);
  const [deckId, setDeckId] = useState<'deck-1' | 'deck-2'>('deck-1');
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('ag_model_dev_completed');
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ag_model_dev_completed', JSON.stringify(completedIds));
    } catch {
      // ignore storage errors
    }
  }, [completedIds]);

  const navigate = (tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeck = (id: 'deck-1' | 'deck-2') => {
    setDeckId(id);
    navigate('presentations');
  };

  const watchVideo = (youtubeId: string) => {
    setActiveYoutubeId(youtubeId);
    navigate('videos');
  };

  const toggleComplete = (id: number) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={navigate}
        completedCount={completedIds.length}
        totalModules={COURSE_MODULES.length}
      />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={navigate}
            onOpenDeck={openDeck}
            completedIds={completedIds}
          />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumView
            completedIds={completedIds}
            onToggleComplete={toggleComplete}
            onOpenDeck={openDeck}
            onWatchVideo={watchVideo}
          />
        )}
        {activeTab === 'presentations' && (
          <PresentationsView initialDeckId={deckId} />
        )}
        {activeTab === 'videos' && (
          <VideoLibraryView
            activeYoutubeId={activeYoutubeId}
            onSelectYoutubeId={setActiveYoutubeId}
          />
        )}
        {activeTab === 'studio' && <AgenticStudioView />}
        {activeTab === 'resources' && <RepoKitView />}
      </main>

      <footer className="no-print border-t border-slate-800/80 bg-surface-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <div>
            Antigravity Model Dev Academy · Built with Gemini Antigravity, React & Tailwind CSS
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://antigravity.google/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Antigravity Docs
            </a>
            <a
              href="https://www.youtube.com/@googleantigravity"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              @googleantigravity
            </a>
            <a
              href="https://github.com/johnnyCRF450/antigravity-model-dev-academy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

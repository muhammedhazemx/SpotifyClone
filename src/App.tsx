import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/PlayerBar';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { ProfileDropdown } from './components/ProfileDropdown';
import { QueuePanel } from './components/QueuePanel';
import { FullscreenOverlay } from './components/FullscreenOverlay';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlaylistView } from './components/PlaylistView';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeaderControls: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/40 text-spotify-text hover:text-white flex items-center justify-center transition-all hover:bg-black/60 focus:outline-none focus:ring-1 focus:ring-spotify-green"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/40 text-spotify-text hover:text-white flex items-center justify-center transition-all hover:bg-black/60 focus:outline-none focus:ring-1 focus:ring-spotify-green"
          aria-label="Go forward"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <SearchBar />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isQueueOpen } = usePlayer();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-spotify-black text-spotify-text font-sans theme-transition">
      {/* Upper Content Panel (Sidebar + Main Viewport + Queue Drawer) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Scrollable Main Content Panel */}
        <main className="flex-1 flex flex-col bg-spotify-dark overflow-y-auto relative rounded-lg m-2 ml-0 border border-spotify-border theme-transition">
          {/* Floating Sticky Header */}
          <header className="sticky top-0 h-16 px-6 md:px-8 flex items-center justify-between z-30 bg-spotify-dark/75 backdrop-blur-md border-b border-spotify-border/40 select-none theme-transition">
            <HeaderControls />

            {/* Right Header Controls: ThemeToggle + ProfileDropdown */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <ProfileDropdown />
            </div>
          </header>

          {/* Routed Views */}
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/playlist/:id" element={<PlaylistView />} />
          </Routes>
        </main>

        {/* Conditional Play Queue Drawer Panel */}
        {isQueueOpen && <QueuePanel />}
      </div>

      {/* Fixed Full Width Bottom Player Bar */}
      <PlayerBar />

      {/* Fullscreen Player Overlay */}
      <FullscreenOverlay />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PlayerProvider>
    </ThemeProvider>
  );
};

export default App;

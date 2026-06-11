import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { SpotifyLogo } from '../assets/SpotifyLogo';
import { NavItem } from './NavItem';
import { PlaylistList } from './PlaylistList';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { likedTrackIds, createPlaylist } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreatePlaylist = () => {
    const newPlaylistId = createPlaylist();
    navigate(`/playlist/${newPlaylistId}`);
  };

  const isHomeActive = location.pathname === '/';
  const isSearchActive = location.pathname === '/search';
  const isLikedActive = location.pathname === '/playlist/liked';

  return (
    <aside className="w-sidebar h-full flex flex-col gap-2 p-2 bg-spotify-black select-none text-spotify-text flex-shrink-0">
      {/* Top Navigation Panel */}
      <div className="bg-spotify-surface rounded-lg p-5 flex flex-col gap-4 border border-spotify-border theme-transition">
        {/* Spotify Logo */}
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <SpotifyLogo className="mb-2" />
        </div>
        
        {/* Nav Links */}
        <div className="space-y-1">
          <NavItem
            name="Home"
            icon={<Home className="w-5 h-5 font-bold" />}
            active={isHomeActive}
            onClick={() => navigate('/')}
          />
          <NavItem
            name="Search"
            icon={<Search className="w-5 h-5" />}
            active={isSearchActive}
            onClick={() => navigate('/search')}
          />
        </div>
      </div>

      {/* Library & Playlists Panel */}
      <div className="flex-1 bg-spotify-surface rounded-lg flex flex-col overflow-hidden border border-spotify-border theme-transition">
        {/* Library Header */}
        <div className="px-5 py-4 flex items-center justify-between text-spotify-muted">
          <button
            className="flex items-center gap-3 hover:text-spotify-text font-bold text-sm tracking-wide transition-colors duration-200"
            onClick={() => navigate('/')}
            aria-label="Your Library"
          >
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </button>
          
          <button
            onClick={handleCreatePlaylist}
            className="hover:text-spotify-text p-1 hover:bg-spotify-surfaceHover rounded-full transition-all duration-200 focus:outline-none"
            aria-label="Create new playlist"
            title="Create Playlist"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts: Liked Songs & Create Playlist */}
        <div className="px-3 pb-2 space-y-1 border-b border-spotify-border">
          {/* Liked Songs Item */}
          <button
            onClick={() => navigate('/playlist/liked')}
            className={`flex items-center gap-3 w-full p-2 rounded-md transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-spotify-green theme-transition group ${
              isLikedActive
                ? 'bg-spotify-surfaceHover'
                : 'hover:bg-spotify-surfaceHover'
            }`}
          >
            {/* Cover Thumbnail */}
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md border border-spotify-border">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold truncate ${
                  isLikedActive ? 'text-spotify-green' : 'text-spotify-text'
                }`}
              >
                Liked Songs
              </p>
              <p className="text-xs text-spotify-muted truncate mt-0.5 font-medium">
                Playlist • {likedTrackIds.length} {likedTrackIds.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </button>
        </div>

        {/* Scrollable Playlist List */}
        <PlaylistList />
      </div>
    </aside>
  );
};

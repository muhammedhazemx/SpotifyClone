import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { Music } from 'lucide-react';

export const PlaylistList: React.FC = () => {
  const { allPlaylists } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2" role="navigation" aria-label="Playlists">
      {allPlaylists.map((playlist) => {
        const isActive = location.pathname === `/playlist/${playlist.id}`;
        return (
          <button
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className={`flex items-center gap-3 w-full p-2 rounded-md transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-spotify-green theme-transition group ${
              isActive
                ? 'bg-spotify-surfaceHover'
                : 'hover:bg-spotify-surfaceHover'
            }`}
          >
            {/* Cover Thumbnail */}
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-spotify-surface flex-shrink-0 flex items-center justify-center border border-spotify-border">
              {playlist.coverUrl ? (
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              ) : (
                <Music className="w-5 h-5 text-spotify-muted" />
              )}
            </div>
            {/* Playlist Info */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold truncate ${
                  isActive ? 'text-spotify-green' : 'text-spotify-text'
                }`}
              >
                {playlist.name}
              </p>
              <p className="text-xs text-spotify-muted truncate mt-0.5 font-medium">
                Playlist • {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

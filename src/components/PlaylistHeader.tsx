import React, { useState, useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useTheme } from '../hooks/useTheme';
import { getGradientStyle } from '../lib/color';
import { Edit2 } from 'lucide-react';

export const PlaylistHeader: React.FC = () => {
  const { currentPlaylist, renamePlaylist, userPlaylists } = usePlayer();
  const { theme } = useTheme();

  const isUserPlaylist = userPlaylists.some(pl => pl.id === currentPlaylist.id);
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(currentPlaylist.name);

  useEffect(() => {
    setTitleInput(currentPlaylist.name);
    setIsEditing(false);
  }, [currentPlaylist]);

  const handleRenameSubmit = () => {
    setIsEditing(false);
    if (titleInput.trim() && titleInput.trim() !== currentPlaylist.name) {
      renamePlaylist(currentPlaylist.id, titleInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setTitleInput(currentPlaylist.name);
      setIsEditing(false);
    }
  };

  // Compute total duration of the playlist
  const totalDurationSeconds = currentPlaylist.tracks.reduce((acc, track) => acc + track.duration, 0);
  
  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const isLight = theme === 'light';
  const gradientStyle = getGradientStyle(currentPlaylist.dominantColor, isLight);

  return (
    <div
      style={gradientStyle}
      className="p-6 pt-16 pb-6 md:p-8 md:pt-24 md:pb-6 flex flex-col gap-6 md:flex-row md:items-end select-none theme-transition relative"
    >
      {/* Playlist Cover Art */}
      <div className="w-48 h-48 md:w-60 md:h-60 rounded-md overflow-hidden shadow-2xl flex-shrink-0 bg-spotify-surface border border-spotify-border group relative">
        <img
          src={currentPlaylist.coverUrl}
          alt={currentPlaylist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Playlist Meta Details */}
      <div className="flex flex-col justify-end text-spotify-text flex-1 min-w-0">
        <span className="text-xs font-bold tracking-widest uppercase mb-1">
          {currentPlaylist.id === 'liked' ? 'Virtual Playlist' : 'Playlist'}
        </span>
        
        {/* Title / Edit inline */}
        {isEditing && isUserPlaylist ? (
          <div className="mb-4">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-4xl md:text-7xl font-extrabold tracking-tight bg-black/40 border border-spotify-border rounded px-2 py-1 outline-none text-spotify-text w-full max-w-2xl focus:ring-1 focus:ring-spotify-green"
              maxLength={30}
              aria-label="Rename playlist"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4 group/title max-w-full">
            <h1
              onClick={() => isUserPlaylist && setIsEditing(true)}
              className={`text-4xl md:text-7xl font-extrabold tracking-tight select-text truncate max-w-full ${
                isUserPlaylist ? 'cursor-pointer hover:underline' : ''
              }`}
              title={isUserPlaylist ? "Click to rename" : undefined}
            >
              {currentPlaylist.name}
            </h1>
            {isUserPlaylist && (
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover/title:opacity-100 p-2 rounded-full hover:bg-black/30 text-spotify-muted hover:text-spotify-text transition-all focus:opacity-100 outline-none"
                aria-label="Edit playlist title"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        <p className="text-sm font-semibold text-spotify-muted mb-4 max-w-2xl select-text leading-relaxed">
          {currentPlaylist.description}
        </p>
        
        {/* Sub-info */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-spotify-text">
          <span className="text-spotify-green hover:underline cursor-pointer">Spotify</span>
          <span className="text-spotify-muted">•</span>
          <span>{currentPlaylist.tracks.length} {currentPlaylist.tracks.length === 1 ? 'song' : 'songs'},</span>
          <span className="text-spotify-muted font-normal">about {formatTotalDuration(totalDurationSeconds)}</span>
        </div>
      </div>
    </div>
  );
};

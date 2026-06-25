import React, { useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useTheme } from '../hooks/useTheme';
import { getGradientStyle } from '../lib/color';
import { Edit2 } from 'lucide-react';

export const PlaylistHeader: React.FC = () => {
  const { currentPlaylist, renamePlaylist, userPlaylists } = usePlayer();
  const { theme } = useTheme();

  const isUserPlaylist = userPlaylists.some(pl => pl.id === currentPlaylist.id);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState<{ playlistId: string; value: string } | null>(null);
  const isEditing = editingPlaylistId === currentPlaylist.id;
  const titleInput = titleDraft?.playlistId === currentPlaylist.id ? titleDraft.value : currentPlaylist.name;

  const handleRenameSubmit = () => {
    setEditingPlaylistId(null);
    setTitleDraft(null);
    if (titleInput.trim() && titleInput.trim() !== currentPlaylist.name) {
      renamePlaylist(currentPlaylist.id, titleInput.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setTitleDraft(null);
      setEditingPlaylistId(null);
    }
  };

  const startEditing = () => {
    setEditingPlaylistId(currentPlaylist.id);
    setTitleDraft({ playlistId: currentPlaylist.id, value: currentPlaylist.name });
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
      className="relative flex flex-col gap-5 p-4 pt-8 pb-6 select-none theme-transition sm:p-6 sm:pt-12 md:flex-row md:items-end md:p-8 md:pt-20"
    >
      {/* Playlist Cover Art */}
      <div className="relative aspect-square w-36 flex-shrink-0 overflow-hidden rounded-md border border-spotify-border bg-spotify-surface shadow-2xl group sm:w-44 md:w-56 lg:w-60">
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
              onChange={(e) => setTitleDraft({ playlistId: currentPlaylist.id, value: e.target.value })}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full max-w-2xl rounded border border-spotify-border bg-black/40 px-2 py-1 text-3xl font-extrabold tracking-tight text-spotify-text outline-none focus:ring-1 focus:ring-spotify-green sm:text-5xl lg:text-7xl"
              maxLength={30}
              aria-label="Rename playlist"
            />
          </div>
        ) : (
          <div className="mb-4 flex max-w-full items-center gap-2 group/title sm:gap-3">
            <h1
              onClick={() => isUserPlaylist && startEditing()}
              className={`max-w-full truncate text-3xl font-extrabold tracking-tight select-text sm:text-5xl lg:text-7xl ${
                isUserPlaylist ? 'cursor-pointer hover:underline' : ''
              }`}
              title={isUserPlaylist ? "Click to rename" : undefined}
            >
              {currentPlaylist.name}
            </h1>
            {isUserPlaylist && (
              <button
                onClick={startEditing}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-spotify-muted opacity-100 transition-all hover:bg-black/30 hover:text-spotify-text focus:opacity-100 focus:outline-none md:opacity-0"
                aria-label="Edit playlist title"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        <p className="mb-4 max-w-2xl text-sm font-semibold leading-relaxed text-spotify-muted select-text">
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

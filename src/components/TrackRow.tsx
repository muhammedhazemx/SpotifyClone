import React, { useState, useEffect, useRef } from 'react';
import type { Track } from '../types/track';
import { formatTime } from '../lib/format';
import { usePlayer } from '../hooks/usePlayer';
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onPause: () => void;
  onLikeToggle: () => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isActive,
  isPlaying,
  isLiked,
  onPlay,
  onPause,
  onLikeToggle,
}) => {
  const { userPlaylists, addTrackToPlaylist } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRowClick = (e: React.MouseEvent) => {
    // Avoid triggering track play if clicking button triggers
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.playlist-menu')) return;
    
    if (isActive) {
      if (isPlaying) onPause();
      else onPlay();
    } else {
      onPlay();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isActive) {
        if (isPlaying) onPause();
        else onPlay();
      } else {
        onPlay();
      }
    } else if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track);
    setIsMenuOpen(false);
  };

  return (
    <tr
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        // Only close menu if mouse leaves and click outside isn't active, but standard is keep it open until click outside
      }}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="row"
      aria-selected={isActive}
      className={`group hover:bg-spotify-surfaceHover rounded-md transition-colors duration-150 cursor-pointer text-sm outline-none focus:bg-spotify-surfaceHover focus:ring-1 focus:ring-spotify-green relative ${
        isActive ? 'bg-spotify-surfaceHover/55' : ''
      }`}
    >
      {/* 1. Track Number or Play/Pause Button */}
      <td className="w-12 text-center py-2.5 rounded-l-md font-semibold text-spotify-muted">
        <div className="flex items-center justify-center h-8 w-8 mx-auto">
          {isHovered ? (
            isActive && isPlaying ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPause();
                }}
                className="text-spotify-text hover:text-white"
                aria-label={`Pause ${track.title} by ${track.artist}`}
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay();
                }}
                className="text-spotify-text hover:text-white"
                aria-label={`Play ${track.title} by ${track.artist}`}
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )
          ) : isActive && isPlaying ? (
            /* Equalizer Animation */
            <div className="flex items-end gap-0.5 w-4 h-4 pb-0.5 text-spotify-green" aria-label="Playing">
              <div className="w-[3px] bg-spotify-green rounded-t-sm animate-eq-1"></div>
              <div className="w-[3px] bg-spotify-green rounded-t-sm animate-eq-2"></div>
              <div className="w-[3px] bg-spotify-green rounded-t-sm animate-eq-3"></div>
              <div className="w-[3px] bg-spotify-green rounded-t-sm animate-eq-4"></div>
            </div>
          ) : (
            <span className={isActive ? 'text-spotify-green font-bold' : ''}>
              {index + 1}
            </span>
          )}
        </div>
      </td>

      {/* 2. Title + Artist */}
      <td className="py-2.5 pr-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-spotify-surface border border-spotify-border">
          <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold truncate text-sm ${
              isActive ? 'text-spotify-green' : 'text-spotify-text'
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-spotify-muted font-medium truncate mt-0.5 hover:underline cursor-pointer">
            {track.artist}
          </p>
        </div>
      </td>

      {/* 3. Album */}
      <td className="py-2.5 pr-4 hidden md:table-cell text-spotify-muted font-semibold truncate max-w-[150px] lg:max-w-[200px]">
        <span className="hover:text-spotify-text cursor-pointer">{track.album}</span>
      </td>

      {/* 4. Date Added */}
      <td className="py-2.5 pr-4 hidden lg:table-cell text-spotify-muted font-medium">
        {track.addedAt}
      </td>

      {/* 5. Heart / Like Button */}
      <td className="py-2.5 w-12 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle();
          }}
          className={`focus:outline-none transition-all duration-200 hover:scale-105 ${
            isLiked
              ? 'text-spotify-green'
              : 'text-spotify-muted opacity-0 group-hover:opacity-100 hover:text-spotify-text focus:opacity-100'
          }`}
          aria-label={isLiked ? `Remove ${track.title} from Liked Songs` : `Save ${track.title} to Liked Songs`}
          aria-pressed={isLiked}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </td>

      {/* 6. Context Menu Options Button ("...") */}
      <td className="py-2.5 w-12 text-center relative">
        <div ref={menuRef} className="playlist-menu inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`focus:outline-none transition-all duration-200 hover:scale-105 text-spotify-muted hover:text-spotify-text ${
              isMenuOpen ? 'text-spotify-text opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
            }`}
            aria-label={`Show options for ${track.title}`}
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal className="w-4.5 h-4.5" />
          </button>

          {/* Absolute Dropdown list */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-spotify-surface border border-spotify-border py-1 z-50 text-left select-none text-spotify-text text-xs font-semibold focus:outline-none">
              <div className="px-3 py-1.5 border-b border-spotify-border text-[10px] text-spotify-muted uppercase tracking-wider">
                Add to playlist
              </div>
              <div className="max-h-40 overflow-y-auto py-1">
                {userPlaylists.length > 0 ? (
                  userPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleAddToPlaylist(pl.id)}
                      className="w-full px-4 py-2 hover:bg-spotify-surfaceHover text-left truncate flex items-center justify-between"
                      title={pl.name}
                    >
                      <span>{pl.name}</span>
                      <Plus className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-spotify-muted italic text-[11px]">
                    No custom playlists. Create one in the sidebar!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* 7. Duration */}
      <td className="py-2.5 pr-4 w-16 text-right rounded-r-md text-spotify-muted font-semibold text-xs tracking-wider">
        {formatTime(track.duration)}
      </td>
    </tr>
  );
};

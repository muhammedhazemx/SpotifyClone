import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { X, Play, Music } from 'lucide-react';
import { formatTime } from '../lib/format';
import type { Track } from '../types/track';

export const QueuePanel: React.FC = () => {
  const {
    currentTrack,
    playingTracks,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
  } = usePlayer();

  if (!isQueueOpen) return null;

  // Find index of current track in queue to show remaining tracks as "Next Up"
  const currentIdx = currentTrack ? playingTracks.findIndex((t) => t.id === currentTrack.id) : -1;
  const nextUpTracks = currentIdx !== -1 ? playingTracks.slice(currentIdx + 1) : [];

  const handleTrackClick = (track: Track) => {
    playTrack(track, playingTracks);
  };

  return (
    <aside
      className="hidden xl:flex w-[320px] h-full bg-spotify-surface rounded-lg flex-col overflow-hidden border border-spotify-border m-2 ml-0 flex-shrink-0 z-10 theme-transition"
      role="complementary"
      aria-label="Play Queue"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-spotify-border select-none">
        <h3 className="font-extrabold text-sm tracking-wide">Play Queue</h3>
        <button
          onClick={() => setIsQueueOpen(false)}
          className="text-spotify-muted hover:text-spotify-text p-1 hover:bg-spotify-surfaceHover rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-spotify-green"
          aria-label="Close Queue"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Queue Scroll List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 select-none">
        {/* Now Playing Section */}
        {currentTrack && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-spotify-muted uppercase tracking-wider">Now playing</h4>
            <div className="flex items-center gap-3 p-2 rounded-md bg-spotify-surfaceHover/60 border border-spotify-border/40 group">
              <img
                src={currentTrack.artworkUrl}
                alt=""
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-spotify-green truncate">{currentTrack.title}</p>
                <p className="text-xs text-spotify-muted truncate mt-0.5 font-medium">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-spotify-muted uppercase tracking-wider">Next up</h4>
          <div className="space-y-1">
            {nextUpTracks.length > 0 ? (
              nextUpTracks.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handleTrackClick(track)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-spotify-surfaceHover cursor-pointer group transition-colors min-w-0"
                >
                  {/* Small play indicator on hover */}
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-black/30 flex-shrink-0">
                    <img
                      src={track.artworkUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:opacity-40"
                    />
                    <Play className="w-4 h-4 text-white fill-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-spotify-text">{track.title}</p>
                    <p className="text-xs text-spotify-muted truncate mt-0.5 font-medium">{track.artist}</p>
                  </div>
                  <span className="text-xs text-spotify-muted font-medium pr-1">
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-spotify-muted text-center">
                <Music className="w-10 h-10 mb-2 opacity-50 stroke-1" />
                <p className="text-xs font-semibold">Queue is empty</p>
                <p className="text-[10px] opacity-75 mt-0.5">Songs will play from the context you started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

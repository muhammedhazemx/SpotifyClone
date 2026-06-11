import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { TransportControls } from './TransportControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { DeviceSelector } from './DeviceSelector';
import { Heart, ListMusic, Maximize2 } from 'lucide-react';

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    likedTrackIds,
    toggleLike,
    isQueueOpen,
    setIsQueueOpen,
    isFullscreenOpen,
    setIsFullscreenOpen,
  } = usePlayer();

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;

  return (
    <footer className="h-player w-full bg-spotify-card border-t border-spotify-border px-4 flex items-center justify-between select-none text-spotify-text theme-transition z-20">
      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        {currentTrack ? (
          <>
            {/* Artwork */}
            <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-spotify-surface border border-spotify-border">
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Titles */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer text-spotify-text">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-spotify-muted truncate mt-0.5 hover:underline cursor-pointer hover:text-spotify-text font-medium">
                {currentTrack.artist}
              </p>
            </div>

            {/* Like button */}
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`focus:outline-none transition-all duration-200 hover:scale-105 ${
                isLiked ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
              }`}
              aria-label={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
              aria-pressed={isLiked}
            >
              <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-spotify-surface border border-spotify-border flex-shrink-0"></div>
            <div>
              <h4 className="text-sm font-semibold text-spotify-muted">No track selected</h4>
            </div>
          </div>
        )}
      </div>

      {/* 2. Transport & Scrubber Controls (Center) */}
      <div className="flex flex-col items-center gap-1.5 w-[40%] max-w-[600px] min-w-[280px]">
        <TransportControls />
        <ProgressBar />
      </div>

      {/* 3. Utility Controls (Right) */}
      <div className="flex items-center gap-3 justify-end w-[30%] min-w-[180px]">
        {/* Queue Toggle Button */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-1.5 rounded-full transition-colors focus:outline-none hover:scale-105 active:scale-95 hidden md:block ${
            isQueueOpen ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
          }`}
          aria-label="Queue"
          title="Play Queue"
        >
          <ListMusic className="w-5 h-5" />
        </button>

        {/* Device Selector Component */}
        <DeviceSelector />

        {/* Volume Slider */}
        <VolumeControl />

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreenOpen(!isFullscreenOpen)}
          className={`p-1.5 rounded-full transition-colors focus:outline-none hover:scale-105 active:scale-95 hidden md:block ${
            isFullscreenOpen ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
          }`}
          aria-label="Fullscreen player"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

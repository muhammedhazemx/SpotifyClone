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
    <footer className="z-20 w-full border-t border-spotify-border bg-spotify-card px-3 py-2 text-spotify-text select-none theme-transition sm:h-player sm:px-4 sm:py-0">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(260px,1.2fr)_minmax(0,1fr)] sm:gap-4 sm:h-full">
      {/* 1. Track Info (Left) */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {currentTrack ? (
          <>
            {/* Artwork */}
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-spotify-border bg-spotify-surface sm:h-14 sm:w-14">
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
              className={`min-h-11 min-w-11 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-1 focus:ring-spotify-green flex items-center justify-center ${
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
            <div className="h-12 w-12 flex-shrink-0 rounded border border-spotify-border bg-spotify-surface sm:h-14 sm:w-14"></div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-spotify-muted">No track selected</h4>
            </div>
          </div>
        )}
      </div>

      {/* 2. Transport & Scrubber Controls (Center) */}
      <div className="flex min-w-0 flex-col items-center gap-1.5 justify-self-end sm:w-full sm:max-w-[620px] sm:justify-self-center">
        <TransportControls />
        <div className="hidden w-full sm:block">
          <ProgressBar />
        </div>
      </div>

      {/* 3. Utility Controls (Right) */}
      <div className="hidden min-w-0 items-center justify-end gap-2 xl:flex">
        {/* Queue Toggle Button */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`min-h-11 min-w-11 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-spotify-green hover:scale-105 active:scale-95 ${
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
          className={`min-h-11 min-w-11 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-spotify-green hover:scale-105 active:scale-95 flex items-center justify-center ${
            isFullscreenOpen ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
          }`}
          aria-label="Fullscreen player"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      <div className="col-span-2 sm:hidden">
        <ProgressBar />
      </div>
      </div>
    </footer>
  );
};

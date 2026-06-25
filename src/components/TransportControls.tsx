import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

export const TransportControls: React.FC = () => {
  const {
    isPlaying,
    isShuffle,
    isRepeat,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 lg:gap-5">
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`relative hidden min-h-11 min-w-11 rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none focus:text-white sm:flex sm:items-center sm:justify-center ${
          isShuffle ? 'text-spotify-green hover:text-[#1fdf64]' : 'text-spotify-muted hover:text-spotify-text'
        }`}
        aria-label="Toggle Shuffle"
        aria-pressed={isShuffle}
      >
        <Shuffle className="w-4 h-4" />
        {isShuffle && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
        )}
      </button>

      {/* Previous Track Button */}
      <button
        onClick={prevTrack}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-spotify-muted transition-all hover:scale-105 hover:text-spotify-text active:scale-95 focus:outline-none focus:ring-1 focus:ring-spotify-green"
        aria-label="Previous track"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Play/Pause Circle Button */}
      <button
        onClick={togglePlay}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-spotify-text text-spotify-black transition-all hover:scale-105 hover:bg-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-spotify-green sm:h-9 sm:w-9"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current text-black" />
        ) : (
          <Play className="w-4 h-4 fill-current text-black ml-0.5" />
        )}
      </button>

      {/* Next Track Button */}
      <button
        onClick={nextTrack}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-spotify-muted transition-all hover:scale-105 hover:text-spotify-text active:scale-95 focus:outline-none focus:ring-1 focus:ring-spotify-green"
        aria-label="Next track"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className={`relative hidden min-h-11 min-w-11 rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none focus:text-white sm:flex sm:items-center sm:justify-center ${
          isRepeat ? 'text-spotify-green hover:text-[#1fdf64]' : 'text-spotify-muted hover:text-spotify-text'
        }`}
        aria-label="Toggle Repeat"
        aria-pressed={isRepeat}
      >
        <Repeat className="w-4 h-4" />
        {isRepeat && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-spotify-green rounded-full"></span>
        )}
      </button>
    </div>
  );
};

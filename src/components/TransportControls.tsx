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
    <div className="flex items-center gap-5 justify-center">
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`relative p-2 rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none focus:text-white ${
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
        className="p-2 text-spotify-muted hover:text-spotify-text rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Previous track"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Play/Pause Circle Button */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-spotify-text hover:bg-white text-spotify-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
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
        className="p-2 text-spotify-muted hover:text-spotify-text rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Next track"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className={`relative p-2 rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none focus:text-white ${
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

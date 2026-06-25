import React, { useEffect } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useTheme } from '../hooks/useTheme';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../lib/format';

export const FullscreenOverlay: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    nextTrack,
    prevTrack,
    setProgress,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isFullscreenOpen,
    setIsFullscreenOpen,
    allPlaylists,
    playingPlaylistId,
  } = usePlayer();
  const { theme } = useTheme();

  // Listen to Escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenOpen(false);
      }
    };
    if (isFullscreenOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen, setIsFullscreenOpen]);

  if (!isFullscreenOpen || !currentTrack) return null;

  const isLight = theme === 'light';
  const playlistName = playingPlaylistId === 'liked'
    ? 'Liked Songs'
    : allPlaylists.find(p => p.id === playingPlaylistId)?.name || 'Playlist';

  const duration = currentTrack.duration;
  const percentage = duration > 0 ? (progress / duration) * 100 : 0;
  const volPercentage = isMuted ? 0 : volume * 100;

  // Dominant color gradient
  const activePlaylist = allPlaylists.find(p => p.id === playingPlaylistId);
  const dominantColor = activePlaylist?.dominantColor || '#1db954';
  const endColor = isLight ? '#f4f4f6' : '#090909';
  const overlayStyle = {
    background: isLight 
      ? `linear-gradient(to bottom, ${dominantColor}50 0%, ${dominantColor}15 50%, ${endColor} 100%)`
      : `linear-gradient(to bottom, ${dominantColor}a0 0%, ${endColor} 100%)`,
  };
  const sliderBgColor = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';

  return (
    <div
      style={overlayStyle}
      className="fixed inset-0 z-50 flex flex-col justify-between p-8 text-spotify-text select-none transition-all duration-500 overflow-hidden"
      role="dialog"
      aria-label="Fullscreen player"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between w-full opacity-80 select-none">
        <button
          onClick={() => setIsFullscreenOpen(false)}
          className="p-2 hover:bg-spotify-surfaceHover rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-spotify-green"
          aria-label="Exit fullscreen"
        >
          <Minimize2 className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-spotify-muted">Playing from playlist</p>
          <p className="font-bold text-sm truncate max-w-xs md:max-w-md mt-0.5">{playlistName}</p>
        </div>

        <div className="w-10"></div> {/* Spacer balance */}
      </div>

      {/* Center Detail Pane */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 gap-6 md:gap-8 max-w-md mx-auto w-full">
        {/* Large Cover Art with strong shadow */}
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-spotify-border/40 bg-spotify-surface flex-shrink-0 animate-pulse-slow">
          <img
            src={currentTrack.artworkUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title and Artist */}
        <div className="text-center w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate text-spotify-text">
            {currentTrack.title}
          </h1>
          <p className="text-sm md:text-base text-spotify-muted font-semibold truncate mt-2">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Bottom Control Pane */}
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Scrubber Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-spotify-muted font-semibold group">
            <span className="w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 flex items-center h-4 relative">
              <input
                type="range"
                min={0}
                max={duration}
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${percentage}%, ${sliderBgColor} ${percentage}%, ${sliderBgColor} 100%)`
                }}
                className="w-full h-1 rounded-md outline-none cursor-pointer appearance-none"
                aria-label="Progress scrubber"
              />
            </div>
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Bottom Playback Center & Volume */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 select-none">
          <div className="w-32 hidden md:block"></div> {/* Spacer balance */}

          {/* Central Transport Circle */}
          <div className="flex items-center gap-6">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none ${
                isShuffle ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
              }`}
              aria-label="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Back */}
            <button
              onClick={prevTrack}
              className="p-2 text-spotify-muted hover:text-spotify-text rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none"
              aria-label="Previous"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-spotify-text hover:scale-105 active:scale-95 text-spotify-black flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-spotify-green"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current text-spotify-black" />
              ) : (
                <Play className="w-6 h-6 fill-current text-spotify-black ml-1" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              className="p-2 text-spotify-muted hover:text-spotify-text rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none"
              aria-label="Next"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full hover:scale-105 active:scale-95 transition-all focus:outline-none ${
                isRepeat ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
              }`}
              aria-label="Repeat"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control right side */}
          <div className="flex items-center gap-2 w-32 group select-none">
            <button
              onClick={toggleMute}
              className="text-spotify-muted hover:text-spotify-text transition-colors focus:outline-none"
              aria-label="Mute toggle"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="flex-1 flex items-center h-4 relative">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${volPercentage}%, ${sliderBgColor} ${volPercentage}%, ${sliderBgColor} 100%)`
                }}
                className="w-full h-1 rounded-md outline-none cursor-pointer appearance-none"
                aria-label="Fullscreen player volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

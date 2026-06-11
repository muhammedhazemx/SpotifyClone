import React, { useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useTheme } from '../hooks/useTheme';
import { formatTime } from '../lib/format';

export const ProgressBar: React.FC = () => {
  const { currentTrack, progress, setProgress } = usePlayer();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const duration = currentTrack ? currentTrack.duration : 0;
  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  const isLight = theme === 'light';
  
  // Custom track coloring: fill color is spotify green on hover, primary text color normally.
  // Unfilled background is light gray/dark gray depending on theme.
  const fillColor = isHovered ? 'var(--color-spotify-green)' : 'var(--color-spotify-text)';
  const trackBgColor = isLight ? 'var(--color-spotify-border)' : '#4d4d4d';

  const trackStyle = {
    background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, ${trackBgColor} ${percentage}%, ${trackBgColor} 100%)`
  };

  return (
    <div
      className="flex items-center gap-2 w-full text-xxs font-semibold text-spotify-muted select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current Time */}
      <span className="w-10 text-right">{formatTime(progress)}</span>

      {/* Progress Slider */}
      <div className="flex-1 flex items-center h-4 relative">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          disabled={!currentTrack}
          style={trackStyle}
          className="w-full h-1 rounded-md outline-none cursor-pointer appearance-none transition-colors"
          aria-label="Music progress scrubber"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={progress}
          aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
        />
        {/* Scrubber thumb circle shown on hover via CSS in index.css */}
      </div>

      {/* Total Duration */}
      <span className="w-10 text-left">{formatTime(duration)}</span>
    </div>
  );
};

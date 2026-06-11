import React, { useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { useTheme } from '../hooks/useTheme';
import { Volume2, Volume1, Volume, VolumeX } from 'lucide-react';

export const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayer();
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const currentVol = isMuted ? 0 : volume;
  const percentage = currentVol * 100;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const isLight = theme === 'light';
  
  // Icon selector based on volume
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-5 h-5" />;
    }
    if (volume < 0.3) {
      return <Volume className="w-5 h-5" />;
    }
    if (volume < 0.7) {
      return <Volume1 className="w-5 h-5" />;
    }
    return <Volume2 className="w-5 h-5" />;
  };

  const fillColor = isHovered ? 'var(--color-spotify-green)' : 'var(--color-spotify-text)';
  const trackBgColor = isLight ? 'var(--color-spotify-border)' : '#4d4d4d';

  const trackStyle = {
    background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percentage}%, ${trackBgColor} ${percentage}%, ${trackBgColor} 100%)`
  };

  return (
    <div
      className="flex items-center gap-2 group w-32 md:w-36 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        className="text-spotify-muted hover:text-spotify-text transition-colors duration-200 focus:outline-none"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>

      {/* Volume slider input */}
      <div className="flex-1 flex items-center h-4 relative">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={currentVol}
          onChange={handleVolumeChange}
          style={trackStyle}
          className="w-full h-1 rounded-md outline-none cursor-pointer appearance-none transition-colors"
          aria-label="Volume slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(currentVol * 100)}
        />
      </div>
    </div>
  );
};

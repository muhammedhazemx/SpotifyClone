import React, { useState, useEffect, useRef } from 'react';
import { Laptop2, Check, Smartphone, Monitor } from 'lucide-react';

export const DeviceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClose);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClose);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Device Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-spotify-green ${
          isOpen ? 'text-spotify-green' : 'text-spotify-muted hover:text-spotify-text'
        }`}
        aria-label="Connect to a device"
        aria-expanded={isOpen}
        title="Connect to a device"
      >
        <Laptop2 className="w-5 h-5" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 bottom-12 mb-2 w-64 rounded-md shadow-2xl bg-spotify-surface border border-spotify-border p-3.5 z-50 text-left select-none text-spotify-text text-sm font-semibold focus:outline-none">
          <h4 className="font-extrabold text-base mb-3 leading-tight tracking-tight">Connect to a device</h4>
          
          <div className="space-y-3">
            {/* Device 1 (Active) */}
            <div className="flex items-center gap-3 text-spotify-green">
              <Laptop2 className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs">Current Device</p>
                <p className="font-extrabold text-sm truncate">This Computer</p>
              </div>
              <Check className="w-4 h-4 flex-shrink-0" />
            </div>

            {/* Device 2 */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 w-full items-center gap-3 text-left text-spotify-muted transition-colors hover:text-spotify-green focus:outline-none focus:text-spotify-green"
            >
              <Smartphone className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs opacity-80">Spotify Connect</p>
                <p className="font-semibold text-sm truncate">My iPhone</p>
              </div>
            </button>

            {/* Device 3 */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 w-full items-center gap-3 text-left text-spotify-muted transition-colors hover:text-spotify-green focus:outline-none focus:text-spotify-green"
            >
              <Monitor className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs opacity-80">AirPlay</p>
                <p className="font-semibold text-sm truncate">Living Room Apple TV</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

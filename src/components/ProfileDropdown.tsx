import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, ExternalLink, LogOut } from 'lucide-react';

export const ProfileDropdown: React.FC = () => {
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
    <div className="relative" ref={containerRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-spotify-border bg-spotify-surface text-xs font-bold text-spotify-text transition-all hover:scale-105 hover:bg-spotify-surfaceHover active:scale-95 focus:outline-none focus:ring-2 focus:ring-spotify-green sm:h-9 sm:w-9"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        U
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-spotify-surface border border-spotify-border py-1 z-50 text-left select-none text-spotify-text text-sm font-semibold focus:outline-none">
          <button
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-spotify-surfaceHover focus:bg-spotify-surfaceHover focus:outline-none"
          >
            <User className="w-4 h-4 text-spotify-muted" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-spotify-surfaceHover focus:bg-spotify-surfaceHover focus:outline-none"
          >
            <Settings className="w-4 h-4 text-spotify-muted" />
            <span>Settings</span>
          </button>
          
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-spotify-surfaceHover focus:bg-spotify-surfaceHover focus:outline-none"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-spotify-muted" />
              <span>Account Website</span>
            </span>
          </a>

          <div className="border-t border-spotify-border/40 my-1"></div>

          <button
            onClick={() => setIsOpen(false)}
            className="flex min-h-11 w-full items-center gap-2.5 px-4 py-2.5 text-left text-red-500 transition-colors hover:bg-spotify-surfaceHover hover:text-red-400 focus:bg-spotify-surfaceHover focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

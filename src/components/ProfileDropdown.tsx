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
        className="flex items-center justify-center w-8 h-8 rounded-full bg-spotify-surface hover:bg-spotify-surfaceHover border border-spotify-border font-bold text-xs hover:scale-105 active:scale-95 transition-all text-spotify-text focus:outline-none focus:ring-2 focus:ring-spotify-green"
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
            className="w-full px-4 py-2.5 hover:bg-spotify-surfaceHover text-left flex items-center gap-2.5 transition-colors focus:outline-none focus:bg-spotify-surfaceHover"
          >
            <User className="w-4 h-4 text-spotify-muted" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2.5 hover:bg-spotify-surfaceHover text-left flex items-center gap-2.5 transition-colors focus:outline-none focus:bg-spotify-surfaceHover"
          >
            <Settings className="w-4 h-4 text-spotify-muted" />
            <span>Settings</span>
          </button>
          
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2.5 hover:bg-spotify-surfaceHover text-left flex items-center justify-between transition-colors focus:outline-none focus:bg-spotify-surfaceHover"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-spotify-muted" />
              <span>Account Website</span>
            </span>
          </a>

          <div className="border-t border-spotify-border/40 my-1"></div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2.5 hover:bg-spotify-surfaceHover text-left flex items-center gap-2.5 text-red-500 hover:text-red-400 transition-colors focus:outline-none focus:bg-spotify-surfaceHover"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

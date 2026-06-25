import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-spotify-border bg-spotify-surface text-spotify-muted transition-all duration-200 hover:bg-spotify-surfaceHover hover:text-spotify-text focus:outline-none focus:ring-2 focus:ring-spotify-green theme-transition sm:min-h-10 sm:min-w-10"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

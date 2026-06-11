import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    globalSearchQuery,
    setGlobalSearchQuery,
  } = usePlayer();
  
  const location = useLocation();
  const isGlobalSearch = location.pathname.startsWith('/search');

  const value = isGlobalSearch ? globalSearchQuery : searchQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isGlobalSearch) {
      setGlobalSearchQuery(val);
    } else {
      setSearchQuery(val);
    }
  };

  const handleClear = () => {
    if (isGlobalSearch) {
      setGlobalSearchQuery('');
    } else {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-spotify-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={isGlobalSearch ? "What do you want to listen to?" : "Search in playlist..."}
        className="w-full pl-9 pr-8 py-2 bg-spotify-surface hover:bg-spotify-surfaceHover border border-spotify-border text-spotify-text placeholder-spotify-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-all duration-200 theme-transition"
        aria-label={isGlobalSearch ? "Search all tracks and playlists" : "Search tracks in current playlist"}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-spotify-muted hover:text-spotify-text focus:outline-none"
          aria-label="Clear search input"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

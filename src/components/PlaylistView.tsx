import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { PlaylistHeader } from './PlaylistHeader';
import { TrackTable } from './TrackTable';
import { mockTracks } from '../data/tracks';
import { Search, Plus, Music, Trash2 } from 'lucide-react';

export const PlaylistView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    currentPlaylist,
    selectPlaylist,
    addTrackToPlaylist,
    userPlaylists,
    deletePlaylist,
  } = usePlayer();
  
  const navigate = useNavigate();
  const [recSearch, setRecSearch] = useState('');

  useEffect(() => {
    if (id) {
      selectPlaylist(id);
    }
  }, [id]);

  const isUserPlaylist = userPlaylists.some(pl => pl.id === currentPlaylist.id);

  // Recommendations logic (show 5 tracks from mockTracks not currently in the playlist)
  const getRecommendedTracks = () => {
    const currentTrackIds = currentPlaylist.tracks.map(t => t.id);
    const available = mockTracks.filter(t => !currentTrackIds.includes(t.id));
    
    if (!recSearch) return available.slice(0, 5);
    
    return available
      .filter(
        t =>
          t.title.toLowerCase().includes(recSearch.toLowerCase()) ||
          t.artist.toLowerCase().includes(recSearch.toLowerCase())
      )
      .slice(0, 5);
  };

  const recommendedTracks = getRecommendedTracks();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${currentPlaylist.name}"?`)) {
      deletePlaylist(currentPlaylist.id);
      navigate('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Playlist Meta Header */}
      <PlaylistHeader />

      {/* Main Action Bar for User Playlist Optionals */}
      {isUserPlaylist && currentPlaylist.tracks.length > 0 && (
        <div className="px-6 md:px-8 pt-4 flex items-center justify-end select-none">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-xs font-bold text-spotify-muted hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Delete playlist"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Playlist</span>
          </button>
        </div>
      )}

      {/* Tracks Table */}
      {currentPlaylist.tracks.length > 0 ? (
        <TrackTable />
      ) : (
        /* Empty Playlist State - Recommended Song Adder */
        <div className="px-6 md:px-8 py-8 space-y-8 select-none">
          <div className="flex flex-col items-center justify-center py-12 text-spotify-muted border-b border-spotify-border/40">
            <Music className="w-16 h-16 mb-4 stroke-1 opacity-55" />
            <h3 className="text-lg font-bold text-spotify-text">This playlist is empty</h3>
            <p className="text-sm font-medium mt-1">Search or add recommended songs below to get started.</p>
            {isUserPlaylist && (
              <button
                onClick={handleDelete}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-red-500 hover:underline focus:outline-none"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete empty playlist</span>
              </button>
            )}
          </div>

          {/* Inline Recommender Grid */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Let's add some songs</h3>
                <p className="text-xs text-spotify-muted font-medium mt-0.5">Based on the title of this playlist</p>
              </div>

              {/* Rec Search Box */}
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-spotify-muted" />
                <input
                  type="text"
                  placeholder="Search for more songs..."
                  value={recSearch}
                  onChange={(e) => setRecSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-spotify-surfaceHover border border-spotify-border text-xs text-spotify-text rounded-full focus:outline-none focus:ring-1 focus:ring-spotify-green theme-transition"
                />
              </div>
            </div>

            {/* Recommended Tracks List */}
            <div className="bg-spotify-card/20 border border-spotify-border/40 rounded-lg p-2 divide-y divide-spotify-border/20">
              {recommendedTracks.length > 0 ? (
                recommendedTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 hover:bg-spotify-surfaceHover rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={track.artworkUrl}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-spotify-text truncate">{track.title}</p>
                        <p className="text-xs text-spotify-muted truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => addTrackToPlaylist(currentPlaylist.id, track)}
                      className="flex items-center gap-1.5 px-4 py-1 border border-spotify-muted hover:border-spotify-text text-xs font-bold rounded-full transition-all active:scale-95 focus:outline-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-spotify-muted py-4 text-center">No other songs match your search terms.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

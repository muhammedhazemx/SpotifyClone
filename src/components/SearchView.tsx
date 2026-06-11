import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { TrackRow } from './TrackRow';
import { Music, Play, Pause } from 'lucide-react';
import type { Track } from '../types/track';

interface GenreCard {
  title: string;
  color: string;
  coverUrl: string;
}

const mockGenres: GenreCard[] = [
  { title: 'Pop', color: '#e8115b', coverUrl: '/covers/synthwave.svg' },
  { title: 'Hip-Hop', color: '#bc5900', coverUrl: '/covers/focus.svg' },
  { title: 'Rock', color: '#e91429', coverUrl: '/covers/synthwave.svg' },
  { title: 'Lo-Fi', color: '#7d4b32', coverUrl: '/covers/lofi.svg' },
  { title: 'Electronic', color: '#7358ff', coverUrl: '/covers/synthwave.svg' },
  { title: 'Chill', color: '#1e3264', coverUrl: '/covers/chill.svg' },
  { title: 'Gaming', color: '#af2896', coverUrl: '/covers/focus.svg' },
  { title: 'Podcasts', color: '#006450', coverUrl: '/covers/liked.svg' },
];

export const SearchView: React.FC = () => {
  const {
    globalSearchQuery,
    allPlaylists,
    currentTrack,
    isPlaying,
    likedTrackIds,
    playTrack,
    togglePlay,
    toggleLike,
  } = usePlayer();
  
  const navigate = useNavigate();

  // Extract all tracks from all playlists (unique by ID)
  const uniqueTracksMap = new Map<string, Track>();
  allPlaylists.forEach((playlist) => {
    playlist.tracks.forEach((track) => {
      uniqueTracksMap.set(track.id, track);
    });
  });
  const allTracks = Array.from(uniqueTracksMap.values());

  // Perform search matches
  const query = globalSearchQuery.toLowerCase().trim();
  const matchedTracks = query
    ? allTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query)
      )
    : [];

  const matchedPlaylists = query
    ? allPlaylists.filter((p) => p.name.toLowerCase().includes(query))
    : [];

  const hasResults = matchedTracks.length > 0 || matchedPlaylists.length > 0;

  // Determine top result: first matched song, or first matched playlist
  const topResultTrack = matchedTracks[0] || null;
  const topResultPlaylist = !topResultTrack ? matchedPlaylists[0] || null : null;

  const handleTopResultPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (topResultTrack) {
      const isActive = currentTrack?.id === topResultTrack.id;
      if (isActive) {
        togglePlay();
      } else {
        playTrack(topResultTrack, matchedTracks);
      }
    } else if (topResultPlaylist) {
      if (topResultPlaylist.tracks.length > 0) {
        playTrack(topResultPlaylist.tracks[0], topResultPlaylist.tracks, topResultPlaylist.id);
      }
    }
  };

  const isTopResultPlaying = isPlaying && currentTrack && (
    (topResultTrack && currentTrack.id === topResultTrack.id) ||
    (topResultPlaylist && topResultPlaylist.tracks.some(t => t.id === currentTrack.id))
  );

  return (
    <div className="flex-1 px-6 md:px-8 py-6 select-none text-spotify-text">
      {/* 1. Browse All State */}
      {!query && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {mockGenres.map((genre) => (
              <div
                key={genre.title}
                className="h-40 rounded-lg overflow-hidden cursor-pointer relative transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: genre.color }}
                onClick={() => navigate('/playlist/playlist-1')} // default routing search tiles
              >
                <span className="absolute top-4 left-4 font-bold text-xl leading-tight select-none">
                  {genre.title}
                </span>
                {/* Angled cover thumbnail */}
                <img
                  src={genre.coverUrl}
                  alt=""
                  className="w-20 h-20 absolute bottom-0 right-0 transform translate-x-4 translate-y-4 rotate-[25deg] shadow-lg object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Active Search Results State */}
      {query && (
        <div className="space-y-8">
          {hasResults ? (
            <>
              {/* Top Section: Spotlight Card + Songs Table */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Spotlight Card */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-2xl font-bold">Top result</h3>
                  <div
                    onClick={() => {
                      if (topResultTrack) {
                        playTrack(topResultTrack, matchedTracks);
                      } else if (topResultPlaylist) {
                        navigate(`/playlist/${topResultPlaylist.id}`);
                      }
                    }}
                    className="group bg-spotify-card/40 hover:bg-spotify-cardHover rounded-lg p-6 transition-all duration-300 cursor-pointer relative flex flex-col items-start gap-5 min-h-[240px]"
                  >
                    {/* Artwork */}
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-spotify-surface shadow-md">
                      <img
                        src={topResultTrack ? topResultTrack.artworkUrl : topResultPlaylist?.coverUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="w-full">
                      <h4 className="text-2xl font-bold truncate text-spotify-text tracking-tight">
                        {topResultTrack ? topResultTrack.title : topResultPlaylist?.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-spotify-muted uppercase bg-black/40 px-2 py-1 rounded">
                          {topResultTrack ? 'Song' : 'Playlist'}
                        </span>
                        {topResultTrack && (
                          <span className="text-sm font-semibold text-spotify-muted truncate hover:underline cursor-pointer">
                            {topResultTrack.artist}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Green play button */}
                    <button
                      onClick={handleTopResultPlay}
                      className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-spotify-green hover:bg-[#1fdf64] shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-2 group-hover:translate-y-0 hover:scale-105 active:scale-95 outline-none z-10"
                      aria-label="Play spotlight result"
                    >
                      {isTopResultPlaying ? (
                        <Pause className="w-6 h-6 text-black fill-current" />
                      ) : (
                        <Play className="w-6 h-6 text-black fill-current ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Songs Table */}
                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-2xl font-bold">Songs</h3>
                  <div className="bg-spotify-card/20 border border-spotify-border/40 rounded-lg p-2 max-h-[300px] overflow-y-auto">
                    <table className="w-full border-collapse" role="grid" aria-label="Search matched songs">
                      <tbody>
                        {matchedTracks.slice(0, 4).map((track, idx) => {
                          const isActive = currentTrack?.id === track.id;
                          const isLiked = likedTrackIds.includes(track.id);

                          return (
                            <TrackRow
                              key={track.id}
                              track={track}
                              index={idx}
                              isActive={isActive}
                              isPlaying={isActive && isPlaying}
                              isLiked={isLiked}
                              onPlay={() => playTrack(track, matchedTracks)}
                              onPause={togglePlay}
                              onLikeToggle={() => toggleLike(track.id)}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Playlists Cards Row */}
              {matchedPlaylists.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Playlists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {matchedPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                        className="group bg-spotify-card/40 hover:bg-spotify-cardHover rounded-lg p-4 transition-all duration-300 cursor-pointer relative flex flex-col min-w-0"
                      >
                        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-spotify-surface mb-4 shadow-md">
                          <img
                            src={playlist.coverUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {/* Play button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (playlist.tracks.length > 0) {
                                playTrack(playlist.tracks[0], playlist.tracks, playlist.id);
                              }
                            }}
                            className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-spotify-green hover:bg-[#1fdf64] shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-2 group-hover:translate-y-0 hover:scale-105 active:scale-95 outline-none z-10"
                            aria-label={`Play ${playlist.name}`}
                          >
                            <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm truncate text-spotify-text mb-1">{playlist.name}</h4>
                        <p className="text-xs text-spotify-muted truncate font-semibold">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-spotify-muted select-none">
              <Music className="w-16 h-16 mb-4 stroke-1 opacity-60" />
              <h3 className="text-lg font-bold text-spotify-text">No results found for "{globalSearchQuery}"</h3>
              <p className="text-sm font-medium mt-1">Please make sure your words are spelled correctly, or try fewer keywords.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
    <div className="flex-1 px-4 py-5 text-spotify-text select-none sm:px-6 md:px-8 md:py-6">
      {/* 1. Browse All State */}
      {!query && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold sm:text-2xl">Browse all</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-6">
            {mockGenres.map((genre) => (
              <div
                key={genre.title}
                className="relative h-32 cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-40"
                style={{ backgroundColor: genre.color }}
                onClick={() => navigate('/playlist/playlist-1')} // default routing search tiles
              >
                <span className="absolute left-3 top-3 text-lg font-bold leading-tight select-none sm:left-4 sm:top-4 sm:text-xl">
                  {genre.title}
                </span>
                {/* Angled cover thumbnail */}
                <img
                  src={genre.coverUrl}
                  alt=""
                  className="absolute bottom-0 right-0 h-16 w-16 translate-x-3 translate-y-3 rotate-[25deg] rounded-md object-cover shadow-lg sm:h-20 sm:w-20 sm:translate-x-4 sm:translate-y-4"
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
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
                {/* Spotlight Card */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold sm:text-2xl">Top result</h3>
                  <div
                    onClick={() => {
                      if (topResultTrack) {
                        playTrack(topResultTrack, matchedTracks);
                      } else if (topResultPlaylist) {
                        navigate(`/playlist/${topResultPlaylist.id}`);
                      }
                    }}
                    className="group relative flex min-h-[220px] cursor-pointer flex-col items-start gap-5 rounded-lg bg-spotify-card/40 p-4 transition-all duration-300 hover:bg-spotify-cardHover sm:min-h-[240px] sm:p-6"
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
                      <h4 className="truncate text-xl font-bold tracking-tight text-spotify-text sm:text-2xl">
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
                      className="absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:bottom-6 md:right-6 md:h-14 md:w-14 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
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
                  <h3 className="text-xl font-bold sm:text-2xl">Songs</h3>
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
                  <h3 className="text-xl font-bold sm:text-2xl">Playlists</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
                    {matchedPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                        className="group relative flex min-w-0 cursor-pointer flex-col rounded-lg bg-spotify-card/40 p-3 transition-all duration-300 hover:bg-spotify-cardHover sm:p-4"
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
                            className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:h-12 md:w-12 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer';
import { Play, Pause } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { allPlaylists, userPlaylists, likedTrackIds, currentTrack, isPlaying, playPlaylist, togglePlay } = usePlayer();
  const navigate = useNavigate();

  const getGreetingText = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Build the shortcut playlists (up to 6)
  // Include Liked Songs as the first shortcut if there are liked tracks
  const shortcuts = [
    {
      id: 'liked',
      name: 'Liked Songs',
      coverUrl: '/covers/liked.svg',
      dominantColor: '#3d1e92',
      tracksCount: likedTrackIds.length
    },
    ...allPlaylists.map(p => ({
      id: p.id,
      name: p.name,
      coverUrl: p.coverUrl,
      dominantColor: p.dominantColor,
      tracksCount: p.tracks.length
    }))
  ].slice(0, 6);

  const handlePlaylistPlay = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    if (currentTrack && isPlaying && playlistId === 'liked') {
      togglePlay();
      return;
    }
    const target = allPlaylists.find(p => p.id === playlistId);
    if (playlistId === 'liked') {
      playPlaylist({
        id: 'liked',
        name: 'Liked Songs',
        description: 'Your liked tracks',
        coverUrl: '/covers/liked.svg',
        dominantColor: '#3d1e92',
        tracks: [] // Context handles fetching liked tracks
      });
    } else if (target) {
      playPlaylist(target);
    }
  };

  return (
    <div className="flex-1 space-y-7 px-4 py-5 text-spotify-text select-none sm:px-6 md:px-8 md:py-6">
      {/* Dynamic Fading Background Header Overlay */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#1e1b4b]/20 to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 space-y-6">
        {/* Time-of-day Greeting */}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{getGreetingText()}</h2>

        {/* Shortcuts 2x3 Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {shortcuts.map((shortcut) => {
            const isCurrentShortcutPlaying = isPlaying && currentTrack && (
              (shortcut.id === 'liked' && likedTrackIds.includes(currentTrack.id)) ||
              (shortcut.id !== 'liked' && allPlaylists.find(p => p.id === shortcut.id)?.tracks.some(t => t.id === currentTrack.id))
            );

            return (
              <div
                key={shortcut.id}
                onClick={() => navigate(`/playlist/${shortcut.id}`)}
                className="group relative flex min-h-20 cursor-pointer items-center overflow-hidden rounded-md bg-spotify-surface/40 transition-all duration-300 hover:bg-spotify-surfaceHover/80 select-none"
              >
                {/* Cover art image */}
                <div className="w-20 h-20 flex-shrink-0 bg-spotify-surface border-r border-spotify-border/40">
                  <img
                    src={shortcut.coverUrl}
                    alt={shortcut.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 min-w-0 flex items-center justify-between">
                  <span className="font-bold truncate text-sm">{shortcut.name}</span>
                  {/* Floating Green Play Button */}
                  <button
                    onClick={(e) => handlePlaylistPlay(e, shortcut.id)}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:h-10 md:w-10 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    aria-label={`Play ${shortcut.name}`}
                  >
                    {isCurrentShortcutPlaying ? (
                      <Pause className="w-4 h-4 text-black fill-current" />
                    ) : (
                      <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Shelves */}
      <div className="relative z-10 space-y-8 pb-8">
        {/* Shelf 1: Recently Played */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold sm:text-2xl">Recently played</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {allPlaylists.slice(0, 5).map((playlist) => (
              <div
                key={`recent-${playlist.id}`}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="group relative flex min-w-0 cursor-pointer flex-col rounded-lg bg-spotify-card/40 p-3 transition-all duration-300 hover:bg-spotify-cardHover sm:p-4"
              >
                {/* Cover art */}
                <div className="relative aspect-square w-full rounded-md overflow-hidden bg-spotify-surface mb-4 shadow-md">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Play Button */}
                  <button
                    onClick={(e) => handlePlaylistPlay(e, playlist.id)}
                    className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:h-12 md:w-12 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    aria-label={`Play ${playlist.name}`}
                  >
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </button>
                </div>
                {/* Title & Description */}
                <h4 className="font-bold text-sm truncate text-spotify-text mb-1">{playlist.name}</h4>
                <p className="text-xs text-spotify-muted truncate font-semibold">{playlist.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shelf 2: Made for you */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold sm:text-2xl">Made for you</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {/* Displaying some static mixes */}
            {[...allPlaylists].reverse().slice(0, 5).map((playlist) => (
              <div
                key={`m4u-${playlist.id}`}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="group relative flex min-w-0 cursor-pointer flex-col rounded-lg bg-spotify-card/40 p-3 transition-all duration-300 hover:bg-spotify-cardHover sm:p-4"
              >
                <div className="relative aspect-square w-full rounded-md overflow-hidden bg-spotify-surface mb-4 shadow-md">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => handlePlaylistPlay(e, playlist.id)}
                    className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:h-12 md:w-12 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    aria-label={`Play ${playlist.name}`}
                  >
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </button>
                </div>
                <h4 className="font-bold text-sm truncate text-spotify-text mb-1">{playlist.name} Daily Mix</h4>
                <p className="text-xs text-spotify-muted truncate font-semibold">Curated songs based on your listening style.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shelf 3: Your Playlists */}
        {userPlaylists.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold sm:text-2xl">Your Playlists</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {userPlaylists.slice(0, 5).map((playlist) => (
                <div
                  key={`user-${playlist.id}`}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="group relative flex min-w-0 cursor-pointer flex-col rounded-lg bg-spotify-card/40 p-3 transition-all duration-300 hover:bg-spotify-cardHover sm:p-4"
                >
                  <div className="relative aspect-square w-full rounded-md overflow-hidden bg-spotify-surface mb-4 shadow-md">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlaylistPlay(e, playlist.id)}
                      className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-spotify-green opacity-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1fdf64] active:scale-95 focus:opacity-100 focus:outline-none md:h-12 md:w-12 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                      aria-label={`Play ${playlist.name}`}
                    >
                      <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm truncate text-spotify-text mb-1">{playlist.name}</h4>
                  <p className="text-xs text-spotify-muted truncate font-semibold">{playlist.tracks.length} tracks</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

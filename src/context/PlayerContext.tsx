import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Track } from '../types/track';
import type { Playlist } from '../types/playlist';
import { mockPlaylists } from '../data/playlists';
import { mockTracks } from '../data/tracks';

interface PlayerContextType {
  // Playlists
  allPlaylists: Playlist[];
  userPlaylists: Playlist[];
  likedTrackIds: string[];
  currentPlaylist: Playlist;
  activePlaylistId: string;
  
  // Active states
  currentTrack: Track | null;
  playingTracks: Track[]; // Track queue
  playingPlaylistId: string | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  
  // Search
  searchQuery: string; // local playlist search
  globalSearchQuery: string; // global search screen
  
  // Actions
  selectPlaylist: (id: string) => void;
  createPlaylist: () => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  
  playTrack: (track: Track, tracksContext: Track[], playlistId?: string) => void;
  playPlaylist: (playlist: Playlist) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setProgress: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLike: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setSearchQuery: (query: string) => void;
  setGlobalSearchQuery: (query: string) => void;
  filteredTracks: Track[];
  
  // UI Panels states
  isQueueOpen: boolean;
  setIsQueueOpen: (open: boolean) => void;
  isFullscreenOpen: boolean;
  setIsFullscreenOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Virtual "Liked Songs" Playlist helper
const createLikedPlaylist = (likedTracks: Track[]): Playlist => ({
  id: 'liked',
  name: 'Liked Songs',
  description: 'Your personal collection of liked tracks.',
  coverUrl: '/covers/liked.svg',
  dominantColor: '#3d1e92',
  tracks: likedTracks,
});

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Liked Songs list
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('spotify_liked_songs');
      return stored ? JSON.parse(stored) : ['track-1', 'track-5', 'track-9'];
    } catch {
      return ['track-1', 'track-5', 'track-9'];
    }
  });

  useEffect(() => {
    localStorage.setItem('spotify_liked_songs', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  const getLikedTracks = useCallback((): Track[] => {
    return mockTracks.filter((track) => likedTrackIds.includes(track.id));
  }, [likedTrackIds]);

  // 2. User Playlists state
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(() => {
    try {
      const stored = localStorage.getItem('spotify_user_playlists');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('spotify_user_playlists', JSON.stringify(userPlaylists));
  }, [userPlaylists]);

  // Combine static and dynamic playlists
  const allPlaylists = useMemo(() => [...mockPlaylists, ...userPlaylists], [userPlaylists]);

  // 3. Current Active viewed playlist state
  const [activePlaylistId, setActivePlaylistId] = useState<string>('playlist-1');
  const currentPlaylist = useMemo(() => {
    if (activePlaylistId === 'liked') {
      return createLikedPlaylist(getLikedTracks());
    }
    return allPlaylists.find(p => p.id === activePlaylistId) || mockPlaylists[0];
  }, [activePlaylistId, allPlaylists, getLikedTracks]);

  // 4. Audio / Playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    return mockPlaylists[0]?.tracks[0] || null;
  });
  const [playingTracks, setPlayingTracks] = useState<Track[]>(() => {
    return mockPlaylists[0]?.tracks || [];
  });
  const [playingPlaylistId, setPlayingPlaylistId] = useState<string | null>('playlist-1');
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgressState] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('spotify_volume');
      return stored ? parseFloat(stored) : 0.5;
    } catch {
      return 0.5;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // UI Panels states
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);

  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persistence of volume
  useEffect(() => {
    localStorage.setItem('spotify_volume', volume.toString());
  }, [volume]);

  // Local track search filter in current playlist
  const filteredTracks = currentPlaylist.tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Playlist management actions
  const selectPlaylist = useCallback((id: string) => {
    setSearchQuery('');
    setActivePlaylistId(id);
  }, []);

  const createPlaylist = (): string => {
    const nextNum = userPlaylists.length + 1;
    const newId = `user-playlist-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      name: `My Playlist #${nextNum}`,
      description: 'A custom user-created playlist.',
      coverUrl: '/covers/liked.svg',
      dominantColor: '#535353',
      tracks: [],
    };
    setUserPlaylists((prev) => [...prev, newPlaylist]);
    return newId;
  };

  const renamePlaylist = (id: string, name: string) => {
    setUserPlaylists((prev) =>
      prev.map((pl) => (pl.id === id ? { ...pl, name } : pl))
    );
  };

  const deletePlaylist = (id: string) => {
    setUserPlaylists((prev) => prev.filter((pl) => pl.id !== id));
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setUserPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.tracks.some((t) => t.id === track.id)) return pl;
          return { ...pl, tracks: [...pl.tracks, track] };
        }
        return pl;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setUserPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
        }
        return pl;
      })
    );
  };

  // Playback actions
  const playTrack = useCallback((track: Track, tracksContext: Track[], playlistId?: string) => {
    setCurrentTrack(track);
    setPlayingTracks(tracksContext);
    if (playlistId) {
      setPlayingPlaylistId(playlistId);
    }
    setProgressState(0);
    setIsPlaying(true);
  }, []);

  const playPlaylist = useCallback((playlist: Playlist) => {
    const listTracks = playlist.id === 'liked' ? getLikedTracks() : playlist.tracks;
    if (listTracks.length > 0) {
      playTrack(listTracks[0], listTracks, playlist.id);
    }
  }, [getLikedTracks, playTrack]);

  const togglePlay = () => {
    if (!currentTrack && playingTracks.length > 0) {
      playTrack(playingTracks[0], playingTracks);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = useCallback(() => {
    if (!currentTrack || playingTracks.length === 0) return;

    if (isRepeat) {
      setProgressState(0);
      return;
    }

    const nextIdx = isShuffle
      ? Math.floor(Math.random() * playingTracks.length)
      : (() => {
      const currentIdx = playingTracks.findIndex((t) => t.id === currentTrack.id);
      return (currentIdx + 1) % playingTracks.length;
    })();

    setCurrentTrack(playingTracks[nextIdx]);
    setProgressState(0);
    setIsPlaying(true);
  }, [currentTrack, isRepeat, isShuffle, playingTracks]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || playingTracks.length === 0) return;

    if (progress > 3) {
      setProgressState(0);
      return;
    }

    const prevIdx = isShuffle
      ? Math.floor(Math.random() * playingTracks.length)
      : (() => {
      const currentIdx = playingTracks.findIndex((t) => t.id === currentTrack.id);
      return currentIdx > 0 ? currentIdx - 1 : playingTracks.length - 1;
    })();

    setCurrentTrack(playingTracks[prevIdx]);
    setProgressState(0);
    setIsPlaying(true);
  }, [currentTrack, isShuffle, playingTracks, progress]);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgressState((prev) => {
          if (prev >= currentTrack.duration) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
            setTimeout(nextTrack, 500);
            return currentTrack.duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack, nextTrack]);

  const setProgress = (seconds: number) => {
    if (!currentTrack) return;
    const boundedSeconds = Math.max(0, Math.min(seconds, currentTrack.duration));
    setProgressState(boundedSeconds);
  };

  const setVolume = (vol: number) => {
    const boundedVol = Math.max(0, Math.min(vol, 1));
    setVolumeState(boundedVol);
    if (boundedVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <PlayerContext.Provider
      value={{
        allPlaylists,
        userPlaylists,
        likedTrackIds,
        currentPlaylist,
        activePlaylistId,
        currentTrack,
        playingTracks,
        playingPlaylistId,
        isPlaying,
        progress,
        volume,
        isMuted,
        isShuffle,
        isRepeat,
        searchQuery,
        globalSearchQuery,
        selectPlaylist,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        playTrack,
        playPlaylist,
        togglePlay,
        nextTrack,
        prevTrack,
        setProgress,
        setVolume,
        toggleMute,
        toggleLike,
        toggleShuffle,
        toggleRepeat,
        setSearchQuery,
        setGlobalSearchQuery,
        filteredTracks,
        isQueueOpen,
        setIsQueueOpen,
        isFullscreenOpen,
        setIsFullscreenOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

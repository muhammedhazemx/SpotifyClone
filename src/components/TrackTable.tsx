import React from 'react';
import { usePlayer } from '../hooks/usePlayer';
import { TrackRow } from './TrackRow';
import { Clock, Music } from 'lucide-react';

export const TrackTable: React.FC = () => {
  const {
    filteredTracks,
    currentTrack,
    isPlaying,
    likedTrackIds,
    playTrack,
    togglePlay,
    toggleLike,
  } = usePlayer();

  if (filteredTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spotify-muted select-none">
        <Music className="w-16 h-16 mb-4 stroke-1 opacity-60" />
        <h3 className="text-lg font-bold text-spotify-text">No results found</h3>
        <p className="text-sm font-medium mt-1">Make sure your words are spelled correctly, or try fewer keywords.</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-8 pb-10">
      <table className="w-full border-collapse table-fixed text-left text-spotify-muted" role="grid" aria-label="Playlist tracks">
        <thead>
          <tr className="border-b border-spotify-border text-xs font-bold uppercase tracking-wider h-9 select-none">
            <th className="w-12 text-center" scope="col">#</th>
            <th className="" scope="col">Title</th>
            <th className="hidden md:table-cell w-[25%] lg:w-[28%]" scope="col">Album</th>
            <th className="hidden lg:table-cell w-[18%]" scope="col">Date added</th>
            <th className="w-12" scope="col"></th>
            <th className="w-12" scope="col"></th>
            <th className="w-16 text-right pr-4" scope="col">
              <Clock className="w-4 h-4 inline-block align-middle" aria-label="Duration" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-transparent">
          {/* Spacer row */}
          <tr className="h-4">
            <td colSpan={7}></td>
          </tr>
          {filteredTracks.map((track, index) => {
            const isActive = currentTrack?.id === track.id;
            const isLiked = likedTrackIds.includes(track.id);

            return (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                isActive={isActive}
                isPlaying={isActive && isPlaying}
                isLiked={isLiked}
                onPlay={() => playTrack(track, filteredTracks)}
                onPause={togglePlay}
                onLikeToggle={() => toggleLike(track.id)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

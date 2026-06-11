import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TrackRow } from '../src/components/TrackRow';
import { Track } from '../src/types/track';
import { PlayerProvider } from '../src/context/PlayerContext';

const mockTrack: Track = {
  id: 'track-1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 185, // 3 mins 5 secs
  addedAt: '2026-06-01',
  artworkUrl: '/covers/synthwave.svg',
};

describe('TrackRow Component', () => {
  it('renders track metadata correctly', () => {
    const handlePlay = vi.fn();
    const handlePause = vi.fn();
    const handleLikeToggle = vi.fn();

    render(
      <PlayerProvider>
        <table>
          <tbody>
            <TrackRow
              track={mockTrack}
              index={0}
              isActive={false}
              isPlaying={false}
              isLiked={false}
              onPlay={handlePlay}
              onPause={handlePause}
              onLikeToggle={handleLikeToggle}
            />
          </tbody>
        </table>
      </PlayerProvider>
    );

    // Verify metadata renders
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('3:05')).toBeInTheDocument(); // 185s = 3:05
    expect(screen.getByText('1')).toBeInTheDocument(); // Index + 1
  });

  it('triggers onLikeToggle when heart button is clicked', () => {
    const handlePlay = vi.fn();
    const handlePause = vi.fn();
    const handleLikeToggle = vi.fn();

    render(
      <PlayerProvider>
        <table>
          <tbody>
            <TrackRow
              track={mockTrack}
              index={0}
              isActive={false}
              isPlaying={false}
              isLiked={false}
              onPlay={handlePlay}
              onPause={handlePause}
              onLikeToggle={handleLikeToggle}
            />
          </tbody>
        </table>
      </PlayerProvider>
    );

    const likeBtn = screen.getByLabelText(/Save Test Song to Liked Songs/i);
    fireEvent.click(likeBtn);

    expect(handleLikeToggle).toHaveBeenCalledTimes(1);
  });
  
  it('shows checkmarks or active styling when liked', () => {
    const handlePlay = vi.fn();
    const handlePause = vi.fn();
    const handleLikeToggle = vi.fn();

    render(
      <PlayerProvider>
        <table>
          <tbody>
            <TrackRow
              track={mockTrack}
              index={0}
              isActive={false}
              isPlaying={false}
              isLiked={true}
              onPlay={handlePlay}
              onPause={handlePause}
              onLikeToggle={handleLikeToggle}
            />
          </tbody>
        </table>
      </PlayerProvider>
    );

    const likeBtn = screen.getByLabelText(/Remove Test Song from Liked Songs/i);
    expect(likeBtn).toBeInTheDocument();
  });
});

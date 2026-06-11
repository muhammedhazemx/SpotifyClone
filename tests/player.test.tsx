import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlayerProvider } from '../src/context/PlayerContext';
import { usePlayer } from '../src/hooks/usePlayer';

const TestPlayerConsumer: React.FC = () => {
  const {
    currentPlaylist,
    currentTrack,
    isPlaying,
    activePlaylistId,
    selectPlaylist,
    togglePlay,
    nextTrack,
  } = usePlayer();

  return (
    <div>
      <span data-testid="playlist-name">{currentPlaylist.name}</span>
      <span data-testid="playlist-id">{activePlaylistId}</span>
      <span data-testid="track-title">{currentTrack ? currentTrack.title : 'No Track'}</span>
      <span data-testid="play-state">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
      <button onClick={togglePlay} data-testid="toggle-play-btn">Play/Pause</button>
      <button onClick={() => selectPlaylist('playlist-2')} data-testid="select-playlist-btn">Select Lofi</button>
      <button onClick={nextTrack} data-testid="next-track-btn">Next</button>
    </div>
  );
};

describe('PlayerContext Audio Simulation', () => {
  it('correctly initializes with default values', () => {
    render(
      <PlayerProvider>
        <TestPlayerConsumer />
      </PlayerProvider>
    );

    expect(screen.getByTestId('playlist-name')).toHaveTextContent('Synthwave Dreams');
    expect(screen.getByTestId('playlist-id')).toHaveTextContent('playlist-1');
    expect(screen.getByTestId('track-title')).toHaveTextContent('Resonance'); // First track of first playlist
    expect(screen.getByTestId('play-state')).toHaveTextContent('PAUSED');
  });

  it('triggers playing state transitions on toggle play/pause click', () => {
    render(
      <PlayerProvider>
        <TestPlayerConsumer />
      </PlayerProvider>
    );

    const playBtn = screen.getByTestId('toggle-play-btn');
    
    // First click: Play
    fireEvent.click(playBtn);
    expect(screen.getByTestId('play-state')).toHaveTextContent('PLAYING');

    // Second click: Pause
    fireEvent.click(playBtn);
    expect(screen.getByTestId('play-state')).toHaveTextContent('PAUSED');
  });

  it('successfully handles switching active playlists', () => {
    render(
      <PlayerProvider>
        <TestPlayerConsumer />
      </PlayerProvider>
    );

    const selectBtn = screen.getByTestId('select-playlist-btn');
    
    fireEvent.click(selectBtn);
    
    expect(screen.getByTestId('playlist-id')).toHaveTextContent('playlist-2');
    expect(screen.getByTestId('playlist-name')).toHaveTextContent('Lofi Vibes');
  });

  it('skips to the next track when next button is triggered', () => {
    render(
      <PlayerProvider>
        <TestPlayerConsumer />
      </PlayerProvider>
    );

    const nextBtn = screen.getByTestId('next-track-btn');
    
    // Default current track: Resonance
    expect(screen.getByTestId('track-title')).toHaveTextContent('Resonance');
    
    fireEvent.click(nextBtn);
    
    // Next track of Synthwave Dreams: Midnight City
    expect(screen.getByTestId('track-title')).toHaveTextContent('Midnight City');
  });
});

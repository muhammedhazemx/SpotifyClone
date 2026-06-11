import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App';

describe('Spotify Clone Advanced Features', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.pathname = '/';
  });

  it('navigates between views via sidebar links and tests back/forward history', () => {
    render(<App />);

    // Starts on Home page (Greeting: Good morning/afternoon/evening)
    expect(screen.getByText(/Good (morning|afternoon|evening)/i)).toBeInTheDocument();

    // Click on Search Sidebar link
    const searchLink = screen.getByRole('link', { name: /search/i });
    fireEvent.click(searchLink);

    // Verify Search Screen is rendered (contains "Browse all" text)
    expect(screen.getByText(/Browse all/i)).toBeInTheDocument();

    // Click on Back button
    const backBtn = screen.getByLabelText(/Go back/i);
    fireEvent.click(backBtn);

    // Verify it navigates back to Home page
    expect(screen.getByText(/Good (morning|afternoon|evening)/i)).toBeInTheDocument();

    // Click on Forward button
    const forwardBtn = screen.getByLabelText(/Go forward/i);
    fireEvent.click(forwardBtn);

    // Verify it navigates forward to Search page
    expect(screen.getByText(/Browse all/i)).toBeInTheDocument();
  });

  it('runs global search matching and empty search states', () => {
    render(<App />);

    // Navigate to Search Screen
    const searchLink = screen.getByRole('link', { name: /search/i });
    fireEvent.click(searchLink);

    // Get search input
    const searchInput = screen.getByPlaceholderText(/What do you want to listen to\?/i);

    // 1. Search for a real song "Resonance"
    fireEvent.change(searchInput, { target: { value: 'Resonance' } });
    
    // Results should show "Resonance" as Song title and "Top result" header
    expect(screen.getByText('Top result')).toBeInTheDocument();
    expect(screen.getAllByText('Resonance').length).toBeGreaterThan(0);

    // 2. Search for a non-existent track
    fireEvent.change(searchInput, { target: { value: 'NonExistentSongQueryXYZ' } });
    
    // Verify empty search text appears
    expect(screen.getByText(/No results found for "NonExistentSongQueryXYZ"/i)).toBeInTheDocument();
  });

  it('creates a new custom playlist, lists it in the sidebar, and navigates to it', () => {
    render(<App />);

    // Click on "+" button in sidebar
    const createBtn = screen.getByLabelText(/Create new playlist/i);
    fireEvent.click(createBtn);

    // Verify a new playlist "My Playlist #1" is added to Your Library sidebar list
    expect(screen.getAllByText('My Playlist #1').length).toBeGreaterThan(0);

    // Verify it navigated to the empty playlist view showing recommender header
    expect(screen.getByText(/This playlist is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Let's add some songs/i)).toBeInTheDocument();
  });

  it('toggles the Profile Menu dropdown open and closed via click and Esc key and checks non-transparency', () => {
    render(<App />);

    const profileBtn = screen.getByLabelText(/User profile menu/i);
    
    // Menu options should not be visible initially
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Log out')).not.toBeInTheDocument();

    // Click profile button to open
    fireEvent.click(profileBtn);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();

    // Verify solid opaque background is present
    const dropdownMenu = screen.getByText('Settings').closest('div');
    expect(dropdownMenu).toHaveClass('bg-spotify-surface');

    // Press Escape key to close
    fireEvent.keyDown(screen.getByText('Settings'), { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Log out')).not.toBeInTheDocument();
  });

  it('flips the player bar themed class when switching theme mode', () => {
    render(<App />);

    // Get the footer player bar element
    const footer = screen.getByRole('contentinfo'); // footer has role="contentinfo"
    expect(footer).toHaveClass('bg-spotify-card');

    // Verify it starts with dark mode (document doesn't have class light)
    expect(document.documentElement.classList.contains('light')).toBe(false);

    // Switch to light mode
    const themeBtn = screen.getByLabelText(/Switch to light mode/i);
    fireEvent.click(themeBtn);

    // Now it should have class 'light'
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(footer).toHaveClass('bg-spotify-card'); // Theme variables change underneath bg-spotify-card
  });

  it('renders distinct shelves without Show All links on Home', () => {
    render(<App />);
    expect(screen.getByText('Recently played')).toBeInTheDocument();
    expect(screen.getByText('Made for you')).toBeInTheDocument();
    expect(screen.queryByText('Show all')).not.toBeInTheDocument();
  });

  it('toggles the play queue drawer', () => {
    render(<App />);
    const queueBtn = screen.getByLabelText(/Queue/i);
    fireEvent.click(queueBtn);
    expect(screen.getByText('Next up')).toBeInTheDocument();
    fireEvent.click(queueBtn);
    expect(screen.queryByText('Next up')).not.toBeInTheDocument();
  });

  it('toggles fullscreen and device popovers', () => {
    render(<App />);
    
    // Fullscreen toggle
    const fsBtn = screen.getByLabelText(/Fullscreen player/i);
    fireEvent.click(fsBtn);
    expect(screen.getByText(/Playing from playlist/i)).toBeInTheDocument();
    
    // The fullscreen view has a close button (Exit fullscreen)
    const closeFsBtn = screen.getByLabelText(/Exit fullscreen/i);
    fireEvent.click(closeFsBtn);
    expect(screen.queryByText(/Playing from playlist/i)).not.toBeInTheDocument();

    // Device popover
    const devBtn = screen.getByLabelText(/Connect to a device/i);
    fireEvent.click(devBtn);
    expect(screen.getByText(/Current Device/i)).toBeInTheDocument();
    
    // Press escape to close device popover
    fireEvent.keyDown(screen.getByText(/Current Device/i), { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText(/Current Device/i)).not.toBeInTheDocument();
  });
});

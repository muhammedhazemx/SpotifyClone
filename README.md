# Spotify Web Player — UI Clone

A front-end clone of the Spotify desktop web player, built with React 18 + TypeScript + Vite + Tailwind CSS.

> Disclaimer: A UI clone built purely for learning. Not affiliated with, authorized, or endorsed by Spotify.

## Features

- **Full app shell** — fixed sidebar, sticky top nav, content grid, and bottom player bar
- **Multiple screens** via React Router — Home, Search, playlist views, and Create Playlist
- **Simulated playback** — play/pause, skip, shuffle, repeat, and progress scrubbing, with an animated EQ on the active track
- **Play queue, device picker, fullscreen view, and profile menu**
- **Search** that filters the current playlist by title, artist, or album
- **Light / dark themes** with localStorage persistence (mute, liked tracks, and volume persist too)
- **Responsive** down to 375px

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with CSS-variable theme tokens
- **Routing:** React Router
- **State:** React Context (player + theme)
- **Testing:** Vitest + Testing Library

## Getting Started

    git clone https://github.com/muhammedhazemx/SpotifyClone.git
    cd SpotifyClone
    npm install
    npm run dev

Build for production: `npm run build`

## Tests

    npm run test

Covers track rendering, play/pause and playlist switching, and theme toggling.

## Project Structure

    src/
      components/   # Sidebar, PlayerBar, TrackTable, TransportControls, etc.
      pages/        # Home, Search, Playlist, Create Playlist
      context/      # PlayerContext, ThemeContext
      data/         # Mock tracks & playlists
      hooks/        # usePlayer, useTheme
      lib/          # formatting & color helpers
      types/        # track & playlist interfaces
    tests/          # Vitest unit tests

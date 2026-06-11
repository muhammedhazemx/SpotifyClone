# Spotify Web Player UI Clone

> **DISCLAIMER**: This project is a front-end UI clone built purely for learning and educational purposes. It is not affiliated with, authorized, maintained, sponsored, or endorsed by Spotify or any of its affiliates or subsidiaries.

A pixel-faithful, senior-grade frontend clone of the **Spotify Desktop Web Player** built with **React 18 + TypeScript + Vite + Tailwind CSS**.

## 🚀 Key Features

- **Pixel-Accurate UI Shell**: Fixed left sidebar with a bubble card layout, sticky scrollable top nav, main content grid, and fixed bottom control player bar.
- **Active Playback State (Simulated)**: Play, pause, skip forward, skip backward, shuffle, repeat, and progress scrubbing. An active track shows an animated green audio equalizer in the tracklist.
- **Custom Light Mode**: A high-fidelity "what-if" light mode that maintains strict **WCAG 2.1 AA** contrast ratios (contrast ≥ 4.5:1 for normal text) using customized CSS variable themes.
- **Persistent State**: Mute state, liked tracks (Heart icon), active volume, and selected color themes are persisted across page reloads via `localStorage`.
- **Search & Filtering**: Search input in the top header filters the selected playlist tracks by title, artist, or album on the fly.
- **Responsive Layout**: Designed to adapt down to 375px screens with layout shifts (e.g. collapsing secondary columns and grid items).
- **Comprehensive Unit Testing**: Includes 9 unit tests checking track rendering, play/pause transitions, playlist switching, and dark/light mode context.

---

## 🎨 Theme Tokens & Design System

Theme tokens are defined as CSS variables in [src/index.css](file:///C:/Users/Muhamed%20Hazem/Desktop/CODE/CVProjects/SpotifyClone/src/index.css) and wired into the Tailwind system inside [tailwind.config.ts](file:///C:/Users/Muhamed%20Hazem/Desktop/CODE/CVProjects/SpotifyClone/tailwind.config.ts).

### Colors

| Token Name | Spotify Dark (Default) | Spotify Light (Concept) | Description |
| :--- | :--- | :--- | :--- |
| `spotify-green` | `#1ed760` (Vibrant green) | `#1aa34a` (Darker green for contrast) | Primary accent buttons & active text |
| `spotify-black` | `#000000` | `#ffffff` | Sidebar background |
| `spotify-dark` | `#121212` | `#f4f4f6` | Main scroll area background |
| `spotify-surface` | `#121212` | `#ffffff` | Elevated surface containers |
| `spotify-surface-hover` | `#1f1f1f` | `#eaeaea` | Row and card hovers |
| `spotify-text` | `#ffffff` | `#121212` | Primary header text |
| `spotify-muted` | `#b3b3b3` | `#5e5e62` | Secondary body text (WCAG compliant) |
| `spotify-border` | `#292929` | `#dcdce0` | Borders & separators |

---

## 📁 Project Structure

```text
spotify-clone/
  public/            # Spotify logo favicon and local cover SVGs
    covers/          # Royalty-free custom vector SVGs for playlist covers
  src/
    components/      # UI Shell Components
      PlayerBar.tsx          # Bottom playback bar
      ProgressBar.tsx        # Centered timeline scrubber
      TransportControls.tsx  # Central transport buttons (shuffle, prev, play, next, repeat)
      VolumeControl.tsx      # Speaker icon + volume slider
      Sidebar.tsx            # Left navigation & library lists
      NavItem.tsx            # Left sidebar nav items
      PlaylistList.tsx       # Sidebar playlist buttons
      PlaylistHeader.tsx     # Large main playlist banner
      TrackTable.tsx         # Tracks wrapper grid header
      TrackRow.tsx           # Individual song row (EQ, Play, Like hover states)
      SearchBar.tsx          # Top bar search input
      ThemeToggle.tsx        # Dark/Light selector
    context/         # Type-safe global states
      PlayerContext.tsx      # Controls active tracks, play status, and progress intervals
      ThemeContext.tsx       # Controls Dark/Light HTML DOM class injection
    data/            # Mock databases
      tracks.ts              # Curated royalty-free mock audio tracks
      playlists.ts           # Playlist descriptors with dominant gradient background colors
    hooks/           # React hooks wrappers
      usePlayer.ts
      useTheme.ts
    lib/             # Helper libraries
      format.ts              # Seconds to mm:ss formatter
      color.ts               # Cover dominant color gradient compiler
    types/           # TypeScript structural interfaces
      track.ts
      playlist.ts
    assets/          # Inline SVG assets
      SpotifyLogo.tsx        # Vector Spotify brand wordmark
    App.tsx          # Main entry shell compiler
    main.tsx         # React root mounting
    index.css        # Main stylesheet, custom scrollbars, range sliders, and EQ keyframe animations
  tests/             # Vitest unit tests
    setup.ts                 # Test matchers and matchMedia mock
    trackRow.test.tsx        # TrackRow metadata & heart click tests
    player.test.tsx          # Playback & playlist switching tests
    theme.test.tsx           # Dark/Light class injection tests
  tailwind.config.ts # Tailwind CSS configuration
  vite.config.ts     # Vite + Vitest configurations
```

---

## 🛠️ Development & Command Line

### Install Dependencies
```bash
npm install
```

### Run Locally (Dev Server)
```bash
npm run dev
```

### Compile Production Bundle
```bash
npm run build
```

### Run Unit Tests
```bash
npm run test
```

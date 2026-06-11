import type { Playlist } from '../types/playlist';
import { mockTracks } from './tracks';

export const mockPlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Synthwave Dreams',
    description: 'Retro synth, neon grids, and high-speed driving beats. Perfect for retrocoding.',
    coverUrl: '/covers/synthwave.svg',
    dominantColor: '#4f46e5', // Indigo gradient base
    tracks: [
      mockTracks[0],  // Resonance
      mockTracks[1],  // Midnight City
      mockTracks[2],  // Nightcall
      mockTracks[3],  // Sunset
      mockTracks[14], // Starboy
    ],
  },
  {
    id: 'playlist-2',
    name: 'Lofi Vibes',
    description: 'Cozy study beats, relaxed lo-fi hip-hop, and warm coffee-shop atmosphere.',
    coverUrl: '/covers/lofi.svg',
    dominantColor: '#854d0e', // Warm brown/amber gradient base
    tracks: [
      mockTracks[4],  // Lo-Fi Nights
      mockTracks[5],  // Coffee Breath
      mockTracks[6],  // Autumn Rain
    ],
  },
  {
    id: 'playlist-3',
    name: 'Chill Mix',
    description: 'A mellow blend of electronic, ambient, and acoustic tunes to help you wind down.',
    coverUrl: '/covers/chill.svg',
    dominantColor: '#0f766e', // Teal gradient base
    tracks: [
      mockTracks[7],  // Intro
      mockTracks[8],  // Digital Love
      mockTracks[9],  // Weightless
      mockTracks[13], // Fly Me to the Moon
    ],
  },
  {
    id: 'playlist-4',
    name: 'Focus Coding',
    description: 'Intense programming soundscapes to lock into your flow state.',
    coverUrl: '/covers/focus.svg',
    dominantColor: '#14532d', // Deep green gradient base
    tracks: [
      mockTracks[10], // Code Refactor
      mockTracks[11], // Infinite Loop
      mockTracks[12], // Callback Hell
    ],
  },
];

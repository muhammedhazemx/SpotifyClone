import type { Track } from './track';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  dominantColor: string; // Hex color code for the fading gradient header
  tracks: Track[];
}

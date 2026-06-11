export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  addedAt: string; // Date string (e.g. "2026-06-01")
  artworkUrl: string;
}

/**
 * Formats a duration in seconds into a string representation: m:ss
 * E.g. 145 -> "2:25"
 * E.g. 62 -> "1:02"
 * E.g. 5 -> "0:05"
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

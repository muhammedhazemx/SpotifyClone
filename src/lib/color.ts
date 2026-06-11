/**
 * Generates an inline CSS style object for the Spotify header gradient.
 * It fades from the dominant color (with 75% opacity) down to the theme's background color.
 */
export const getGradientStyle = (hexColor: string, isLight: boolean) => {
  const endColor = isLight ? '#f4f4f6' : '#121212';
  return {
    background: `linear-gradient(to bottom, ${hexColor}bf 0%, ${hexColor}85 35%, ${hexColor}40 65%, ${hexColor}10 88%, ${endColor} 100%)`,
  };
};

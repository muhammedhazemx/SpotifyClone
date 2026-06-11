import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '../src/context/ThemeContext';
import { useTheme } from '../src/hooks/useTheme';

const TestThemeConsumer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme-name">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-theme-btn">Toggle Mode</button>
    </div>
  );
};

describe('ThemeContext Theme Control', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('starts with dark mode by default', () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-name')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('updates HTML classes and localStorage when toggled to light mode', () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-theme-btn');
    
    // Switch to Light
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('theme-name')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('spotify_theme')).toBe('light');

    // Switch back to Dark
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('theme-name')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem('spotify_theme')).toBe('dark');
  });
});

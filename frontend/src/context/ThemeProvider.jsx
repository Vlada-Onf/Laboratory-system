import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createAppTheme from '../theme/theme';
import { ThemeModeContext } from './ThemeContext';

export const ThemeProviderWrapper = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = useMemo(
    () => createAppTheme(isDarkMode),
    [isDarkMode]
  );

  const value = useMemo(() => ({
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
  }), [isDarkMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

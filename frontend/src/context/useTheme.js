import { useContext } from 'react';
import { ThemeModeContext } from './ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

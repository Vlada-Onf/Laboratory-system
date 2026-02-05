import React, { memo } from 'react';
import { Paper } from '@mui/material';
import { useTheme } from '../../context/useTheme';

const Item = memo(({ children, sx }) => {
  const { isDarkMode } = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: isDarkMode
          ? 'rgba(8, 39, 59, 0.35)'
          : '#ffffff',
        color: isDarkMode
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(0, 0, 0, 0.87)',
        backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(8, 39, 59, 0.45)'
          : '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: isDarkMode
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.12)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
});

export default Item;

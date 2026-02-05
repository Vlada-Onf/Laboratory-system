import React from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '../../../context/useTheme';

const ButtonsPanel = () => {
  const { isDarkMode } = useTheme();

  return (
    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        fullWidth
        sx={{
          fontSize: 16,
          height: 58,
          background: 'linear-gradient(135deg, #08273b, #365468)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #051926, #20314a)',
          },
        }}
      >
        Редагувати
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          fontSize: 16,
          height: 58,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#08273b',
          '&:hover': {
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(10,14,57,0.08)',
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.5)'
              : '#051926',
            color: isDarkMode
              ? 'rgba(255, 255, 255, 1)'
              : '#051926',
          },
        }}
      >
        В потреби
      </Button>

      <Button
        variant="contained"
        fullWidth
        sx={{
          fontSize: 16,
          height: 58,
          background: 'linear-gradient(135deg, #f16731, #f4926c)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #b74e24, #d07f5e)',
          },
        }}
      >
        Видалити
      </Button>
    </Box>
  );
};

export default ButtonsPanel;

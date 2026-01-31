import React from 'react';
import { Box, Button } from '@mui/material';

const ButtonsPanel = () => (
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
        color: '#08273b',
        borderColor: '#08273b',
        '&:hover': {
          backgroundColor: 'rgba(10,14,57,0.08)',
          borderColor: '#051926',
          color: '#051926',
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

export default ButtonsPanel;

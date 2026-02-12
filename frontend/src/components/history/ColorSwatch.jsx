import React from 'react';
import { Box } from '@mui/material';

const ColorSwatch = ({ color, size = 24, label = false }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: 1,
      border: '2px solid',
      borderColor: 'grey.300',
      backgroundColor: color,
      position: 'relative',
      mr: 0.5,
      ...(label && {
        '&:hover .label': { opacity: 1 }
      })
    }}
  >
    {label && (
      <Typography
        variant="caption"
        className="label"
        sx={{
          position: 'absolute',
          bottom: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0,
          transition: 'opacity 0.2s',
          whiteSpace: 'nowrap',
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 0.5,
          borderRadius: 0.5
        }}
      >
        {color}
      </Typography>
    )}
  </Box>
);

export default ColorSwatch;

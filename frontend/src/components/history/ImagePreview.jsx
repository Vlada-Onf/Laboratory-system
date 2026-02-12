import React from 'react';
import { Box, Typography } from '@mui/material';

const ImagePreview = ({ imageUrl, size = 32 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: 1,
      border: '2px solid',
      borderColor: 'grey.300',
      backgroundColor: 'grey.100',
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      mr: 0.5,
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.1)',
        opacity: 0,
        transition: 'opacity 0.2s'
      },
      '&:hover::after': {
        opacity: 1
      }
    }}
  />
);

export default ImagePreview;

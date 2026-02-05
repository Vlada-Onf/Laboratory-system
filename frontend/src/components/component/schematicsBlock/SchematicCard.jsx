import React from 'react';
import { Box, Typography } from '@mui/material';

const SchematicCard = ({ name, image, link }) => (
  <Box
    component="a"
    href={link}
    target="_blank"
    rel="noopener"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 200,
      borderRadius: 2,
      boxShadow: 1,
      overflow: 'hidden',
      textDecoration: 'none',
      color: 'inherit',
      '&:hover': { boxShadow: 3 },
    }}
  >
    <Box
      component="img"
      src={image}
      alt={name}
      sx={{ width: '100%', height: 140, objectFit: 'cover' }}
    />
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1,
      }}
    >
      <Typography
        variant="body1"
        fontWeight={500}
        sx={{
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {name}
      </Typography>
    </Box>
  </Box>
);

export default SchematicCard;

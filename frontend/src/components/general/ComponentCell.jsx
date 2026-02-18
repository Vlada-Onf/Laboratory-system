import React, { memo } from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const ComponentCell = memo(({ image, name }) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={image}
        alt={name}
        variant="rounded"
        sx={{ width: 60, height: 60 }}
      />
      <Typography
        variant="body1"
        sx={{ fontWeight: 600 }}
      >
        {name}
      </Typography>
    </Box>
  );
});

ComponentCell.displayName = 'ComponentCell';
export default ComponentCell;

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const ComponentCell = ({ image, name }) => {
  return (
    <Box display="flex" alignItems="center">
      <Avatar
        src={image}
        alt={name}
        variant="rounded"
        sx={{ width: 60, height: 60, mr: 2 }}
      />
      <Typography fontWeight={600}>
        {name}
      </Typography>
    </Box>
  );
};

export default ComponentCell;

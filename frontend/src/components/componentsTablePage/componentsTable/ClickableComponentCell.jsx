import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const ClickableComponentCell = ({ row, onClick }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(row.id)}
    >
      <Avatar src={row.image} alt={row.name} variant="rounded" sx={{ width: 60, height: 60, mr: 2 }} />
      <Typography fontWeight={600}>{row.name}</Typography>
    </Box>
  );
};

export default ClickableComponentCell;

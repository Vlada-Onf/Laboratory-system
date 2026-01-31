import React, { memo } from 'react';
import { Paper } from '@mui/material';

const Item = memo(({ children, sx }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: 2,
      ...sx,
    }}
  >
    {children}
  </Paper>
));

export default Item;

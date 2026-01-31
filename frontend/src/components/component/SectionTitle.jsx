import React from 'react';
import { Typography } from '@mui/material';

const SectionTitle = ({ children, color }) => (
  <Typography
    sx={{
      mb: 2,
      fontSize: 18,
      fontWeight: 500,
      color: color || '#333',
    }}
  >
    {children}
  </Typography>
);

export default SectionTitle;

import React from 'react';
import { Box, Typography } from '@mui/material';
import LinkBadge from './LinkBadge';

const LinksRow = ({ title, links, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
    <Typography variant="body2" sx={{ fontWeight: 500, fontSize:18, mr: 1 }}>
      {title}:
    </Typography>
    {links.map((link, index) => (
      <LinkBadge key={index} url={link} color={color} />
    ))}
  </Box>
);

export default LinksRow;

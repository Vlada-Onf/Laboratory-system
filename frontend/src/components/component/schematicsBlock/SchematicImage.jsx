import React from 'react';
import { Box } from '@mui/material';

const SchematicImage = ({ photoUrl, title }) => (
  <Box sx={{ mb: 4, width: '100%' }}>
    <Box 
      component="img" 
      src={photoUrl} 
      alt={title}
      sx={{ 
        width: '100%', 
        height: 'auto', 
        maxHeight: { xs: 400, md: 600, lg: 700 },
        objectFit: 'contain', 
        borderRadius: 3, 
        boxShadow: 3,
        display: 'block',
        mx: 'auto'
      }} 
    />
  </Box>
);

export default React.memo(SchematicImage);

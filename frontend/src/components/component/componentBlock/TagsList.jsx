import React from 'react';
import { Box, Chip } from '@mui/material';

const TagsList = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return <span>—</span>;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </Box>
  );
};

export default React.memo(TagsList);

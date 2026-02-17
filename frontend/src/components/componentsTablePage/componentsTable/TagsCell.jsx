import React from 'react';
import { Box, Chip } from '@mui/material';

const TagsCell = ({ value }) => {
  const safeTags = React.useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    
    return value.map(tag => {
      if (typeof tag === 'object' && tag?.name) return tag.name;
      if (typeof tag === 'object' && tag?.title) return tag.title;
      return String(tag).trim();
    }).filter(Boolean);
  }, [value]);

  if (!safeTags.length) {
    return "—";
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {safeTags.map((tag, index) => (
        <Chip key={index} label={tag} size="small" />
      ))}
    </Box>
  );
};

export default TagsCell;

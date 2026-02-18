import React, {useMemo} from 'react';
import { Box, Chip } from '@mui/material';

const TagsList = ({ tags }) => {
  const displayTags = useMemo(() => {
    if (!tags){
      return [];
    }
    
    return (Array.isArray(tags) ? tags : []).map(tag => 
      typeof tag === 'object' ? (tag.name || tag.id || String(tag)) : String(tag)
    ).filter(Boolean);
  }, [tags]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {displayTags.map((tagName, index) => (
        <Chip 
          key={`${tagName}-${index}`} 
          label={tagName}
          size="small" 
        />
      ))}
    </Box>
  );
};


export default React.memo(TagsList);

import React from 'react';
import { Chip } from '@mui/material';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';


const PriorityChip = ({ priority }) => {
  const { importances } = useWishlistImportancesStore();
  
  const priorityName = importances.find(i => i.id === priority)?.name || priority || 'Низька';

  return (
    <Chip
      label={priorityName}
      sx={{
        fontWeight: 700,
      }}
      variant="outlined"
    />
  );
};

export default PriorityChip;

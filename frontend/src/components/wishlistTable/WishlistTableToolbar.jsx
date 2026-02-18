import React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const WishlistTableToolbar = ({ onAddClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
      >
        Додати до списку
      </Button>
    </Box>
  );
};

export default WishlistTableToolbar;

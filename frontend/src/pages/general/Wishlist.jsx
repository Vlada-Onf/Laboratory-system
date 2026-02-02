import React from 'react';
import { Box, Typography } from '@mui/material';
import WishlistTable from '../../components//wishlistTable/WishlistTable';
import { useNeedsStore } from '../../store/useNeedsStore';

const Wishlist = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <Box p={3}>
      <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Список бажаного
            </Typography>
      <WishlistTable onAddNeed={addNeed} />
    </Box>
  );
};

export default Wishlist;

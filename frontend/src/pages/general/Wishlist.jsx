import React from 'react';
import { Box, Typography } from '@mui/material';
import WishlistTable from '../../components//wishlistTable/WishlistTable';

const Wishlist = () => {
  return (
    <Box p={3}>
      <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Список бажаного
            </Typography>
      <WishlistTable />
    </Box>
  );
};

export default Wishlist;

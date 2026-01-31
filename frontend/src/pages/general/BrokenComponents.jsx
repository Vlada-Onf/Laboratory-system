import React from 'react';
import { Box, Typography } from '@mui/material';
import BrokenComponentsTable from '../../components/brokenComponents/BrokenComponentsTable';

const BrokenComponents = () => {
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Пошкоджені компоненти
      </Typography>

      <BrokenComponentsTable />
    </Box>
  );
};

export default BrokenComponents;

import React from 'react';
import { Box, Typography } from '@mui/material';
import BrokenComponentsTable from '../../components/brokenComponents/BrokenComponentsTable';
import { useNeedsStore } from '../../store/useNeedsStore';


const BrokenComponents = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <Box sx={{ p: 2, width: '100%' }}>
      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Пошкоджені компоненти
      </Typography>

      <BrokenComponentsTable onAddNeed={addNeed}/>
    </Box>
  );
};

export default BrokenComponents;

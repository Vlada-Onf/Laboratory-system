import React from 'react';
import { Box, Typography } from '@mui/material';
import BrokenComponentsTable from '../../components/brokenComponents/BrokenComponentsTable';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';

const BrokenComponents = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <PageWrapper>
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Зламані компоненти
        </Typography>

        <BrokenComponentsTable onAddNeed={addNeed} />
      </Box>
    </PageWrapper>
  );
};

export default BrokenComponents;

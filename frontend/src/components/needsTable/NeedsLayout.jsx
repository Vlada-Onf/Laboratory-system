import React from 'react';
import { Box, Stack } from '@mui/material';
import NeedsTable from './NeedsTable';
import AiStockPredictionCard from './AIStockPredictionCard';

const NeedsLayout = () => {
  return (
    <Stack spacing={3} width="100%">
      <Box>
        <NeedsTable />
      </Box>

      <Box>
        <AiStockPredictionCard />
      </Box>
    </Stack>
  );
};

export default NeedsLayout;
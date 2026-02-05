import React from 'react';
import { Box, Typography } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';

const History = () => {
  return (
    <PageWrapper>
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" fontWeight={700}>
          Історія усіх змін
        </Typography>
      </Box>
    </PageWrapper>
  );
};

export default History;

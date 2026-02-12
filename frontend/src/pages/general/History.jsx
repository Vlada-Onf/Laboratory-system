import React from 'react';
import { Box, Typography } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import HistoryList from '../../components/history/HistoryList';
import { useHistory } from '../../hooks/useHistory';

const History = () => {
  const { history, isLoading } = useHistory();

  return (
    <PageWrapper>
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Історія усіх змін ({history.length})
        </Typography>

        <Box sx={{ mt: 3 }}>
          <HistoryList history={history} isLoading={isLoading} />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default History;
import React from 'react';
import { Box, Typography } from '@mui/material';
import HistoryItem from './HistoryItem';

const HistoryList = ({ history, isLoading = false }) => {
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Завантаження історії...
        </Typography>
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Історія змін порожня
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {history.map((record) => (
        <HistoryItem key={record.id} record={record} />
      ))}
    </Box>
  );
};

export default HistoryList;

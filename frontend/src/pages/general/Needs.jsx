import React from 'react';
import { Box, Typography } from '@mui/material';
import NeedsTable from '../../components/needsTable/NeedsTable'; // <-- імпорт таблиці

const Needs = () => {
  return (
    <Box p={3}>
      <NeedsTable />
    </Box>
  );
};

export default Needs;

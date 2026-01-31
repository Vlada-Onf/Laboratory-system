import React from 'react';
import { Box, Typography } from '@mui/material';
import NeedsTable from '../../components/needsTable/NeedsTable'; // <-- імпорт таблиці

const Needs = () => {
  return (
    <Box p={3}>
      <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Заплановані покупки
            </Typography>
      <NeedsTable />
    </Box>
  );
};

export default Needs;

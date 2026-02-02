import React from 'react';
import { Box, Typography } from '@mui/material';
import NeedsTable from '../../components/needsTable/NeedsTable';
import { useNeedsStore } from '../../store/useNeedsStore';

const Needs = () => {
  const needsRows = useNeedsStore((state) => state.needsRows);

  return (
    <Box p={3}>
      <Typography
              variant="h5"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Заплановані покупки
            </Typography>
      <NeedsTable rows={needsRows}/>
    </Box>
  );
};

export default Needs;

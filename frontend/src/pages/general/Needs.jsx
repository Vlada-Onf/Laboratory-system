import React from 'react';
import { Box, Typography } from '@mui/material';
import NeedsTable from '../../components/needsTable/NeedsTable';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';

const Needs = () => {
  const needsRows = useNeedsStore((state) => state.needsRows);

  return (
    <PageWrapper>
      <Box p={2}>
            <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Заплановані покупки
                  </Typography>
            <NeedsTable rows={needsRows}/>
          </Box>
    </PageWrapper>
  );
};

export default Needs;

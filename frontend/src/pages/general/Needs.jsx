import { Box, Typography } from '@mui/material';
import NeedsTable from '../../components/needsTable/NeedsTable';
import PageWrapper from '../../components/layout/PaperWrapper';

const Needs = () => {

  return (
    <PageWrapper>
      <Box p={2}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Заплановані покупки</Typography>
            <NeedsTable />
          </Box>
    </PageWrapper>
  );
};

export default Needs;

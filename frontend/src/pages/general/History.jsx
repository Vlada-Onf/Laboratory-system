import { Box, Typography } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import HistoryList from '../../components/history/HistoryList';

const History = () => {

  return (
    <PageWrapper>
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Історія змін в системі
        </Typography>

        <Box sx={{ mt: 3 }}>
          <HistoryList type="all" />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default History;

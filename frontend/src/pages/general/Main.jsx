import { Box } from '@mui/material';
import HistoryBlock from '../../components/historyFragmentBlock/HistoryBlock';
import AiStockPredictionCard from '../../components/needsTable/AIStockPredictionCard';
import MainLayout from '../../components/main/MainLayout';
import PageWrapper from '../../components/layout/PaperWrapper';

const Main = () => {
  return (
    <PageWrapper>
      <Box p={8}>
             <MainLayout
              title="Вітаємо в системі"
              topRightContent={<AiStockPredictionCard />}
              bottomContent={<HistoryBlock />}
            />
          </Box>
    </PageWrapper>
  );
};

export default Main;
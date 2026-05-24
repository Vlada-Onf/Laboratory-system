import { Box } from '@mui/material';
import HistoryBlock from '../../components/historyFragmentBlock/HistoryBlock';
import AiStockPredictionCard from '../../components/needsTable/AIStockPredictionCard';
import MainLayout from '../../components/main/MainLayout';

const Main = () => {
  return (
    <Box p={8}>
      <MainLayout
        title="Вітаємо в системі"
        topRightContent={<AiStockPredictionCard />}
        bottomContent={<HistoryBlock />}
      />
    </Box>
  );
};

export default Main;
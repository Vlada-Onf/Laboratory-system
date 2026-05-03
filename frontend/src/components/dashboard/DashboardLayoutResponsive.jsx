import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from 'react';
import PageWrapper from '../layout/PaperWrapper';
import DashboardCard from './DashboardCard';
import { useDashboardData } from '../../hooks/dashboard/useDashboardData';
import ComponentsCostByCategoryChart from './ComponentsCostByCategoryChart';
import ComponentsCountPieChart from './ComponentsCountPieChart';
import ComponentsCostSparkLine from './SparkLineCard/ComponentsCostSparkLine';
import ComponentsCountSparkLine from './SparkLineCard/ComponentsCountSparkLine';
import BrokenComponentsCostSparkLine from './SparkLineCard/BrokenComponentsCostSparkLine';
import BrokenComponentsCountSparkLine from './SparkLineCard/BrokenComponentsCountSparkLine';

const DashboardResponsive = () => {
  const { handleRefreshStatistics } = useDashboardData();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(() => {
  const saved = localStorage.getItem('lastStatsUpdate');
  return saved ? new Date(saved) : null;
});

  const handleClickRefresh = () => {
    const now = new Date();

    if (lastUpdated) {
      const sameDay =
        now.toDateString() === new Date(lastUpdated).toDateString();

      if (sameDay) {
        setOpenSnackbar(true);
        return;
      }
    }

    handleRefreshStatistics();
    setLastUpdated(now);
    localStorage.setItem('lastStatsUpdate', now.toISOString());
  };

  return (
    <PageWrapper>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleClickRefresh}
          sx={{
            background: 'linear-gradient(135deg, #08273b, #365468)',
            color: '#fff',
            '&:hover': { background: 'linear-gradient(135deg, #051926, #20314a)' },
          }}
        >
          Оновити статистику
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        gap: 1,
        overflowY: 'auto'
      }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1,
            width: '100%'
          }}>
            <DashboardCard sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCostSparkLine />
            </DashboardCard>
            <DashboardCard sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCountSparkLine />
            </DashboardCard>
          </Box>

          <DashboardCard sx={{ flex: 1 }} chart>
            <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 500 }}>
              Вартість компонентів за категоріями
            </Typography>
            <ComponentsCostByCategoryChart />
          </DashboardCard>
        </Box>

        <Box sx={{
          width: { xs: '100%', lg: 450 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <DashboardCard sx={{ flex: 1, minHeight: 300 }}>
            <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 500 }}>
              Кількість компонентів за категоріями
            </Typography>
            <ComponentsCountPieChart />
          </DashboardCard>

          <DashboardCard sx={{ flex: 1 }}>
            <BrokenComponentsCostSparkLine />
          </DashboardCard>

          <DashboardCard sx={{ flex: 1}}>
            <BrokenComponentsCountSparkLine />
          </DashboardCard>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setOpenSnackbar(false)}>
          Статистика оновлюється лише раз на добу. Сьогоднішня статистика вже актуальна.
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default DashboardResponsive;
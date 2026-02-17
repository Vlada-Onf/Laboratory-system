import React from 'react';
import { Box, Paper, Typography , Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';  
import PageWrapper from '../../components/layout/PaperWrapper';
import { useTheme } from '../../context/useTheme';
import ComponentsCostByCategoryChart from './ComponentsCostByCategoryChart';
import ComponentsCountPieChart from './ComponentsCountPieChart';
import ComponentsCostSparkLine from './SparkLineCard/ComponentsCostSparkLine';
import ComponentsCountSparkLine from './SparkLineCard/ComponentsCountSparkLine';
import BrokenComponentsCountSparkLine from './SparkLineCard/BrokenComponentsCountSparkLine';
import BrokenComponentsCostSparkLine from './SparkLineCard/BrokenComponentsCostSparkLine';
import { useDashboardStore } from '@store/useDashboardStore';
import { useComponentsStore } from '@store/useComponentsStore';

const Item = ({ children, sx }) => {
  const { isDarkMode } = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: isDarkMode ? 'rgba(8, 39, 59, 0.35)' : '#ffffff',
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
        backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(8, 39, 59, 0.45)'
          : '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.12)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

const ChartItem = ({ children, sx }) => {
  const { isDarkMode } = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: isDarkMode ? 'rgba(8, 39, 59, 0.35)' : '#ffffff',
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
        boxShadow: isDarkMode ? '0 8px 32px rgba(8, 39, 59, 0.45)' : '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.12)',
        isolation: 'isolate',
        contain: 'paint',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

const SectionTitle = ({ children }) => (
  <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 500 }}>
    {children}
  </Typography>
);

const DashboardResponsive = () => {
  const { 
    fetchDashboardStatistics, 
    createStatistic,
    getLatestStatistic
  } = useDashboardStore();
  const { fetchComponents } = useComponentsStore();

  React.useEffect(() => {
    fetchDashboardStatistics();
    fetchComponents();
  }, [fetchDashboardStatistics, fetchComponents]);

  const handleRefreshStatistics = async () => {
    console.log('Створюємо СЬОГОДНІШНЮ статистику...');
    
  try {
      const latestStat = getLatestStatistic();
      const todayISO = new Date().toISOString();
      
      console.log('Сьогодні:', todayISO);
      console.log('Останній запис:', latestStat?.statisticDate);
      
      await createStatistic(todayISO);
      
      await fetchComponents();
      
    } catch (error) {
      console.error('Помилка:', error);
    }
  };


  return (
    <PageWrapper>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshStatistics}
          sx={{
            background: 'linear-gradient(135deg, #08273b, #365468)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)',
            },
            }}
        >
          Оновити статистику
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, width: '100%', gap: 1, overflowY: 'auto' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1, width: '100%' }}>
            <Item sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCostSparkLine />
            </Item>
            <Item sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCountSparkLine />
            </Item>
          </Box>


          <ChartItem sx={{ flex: 1 }}>
            <SectionTitle>Вартість компонентів за категоріями</SectionTitle>
            <Box sx={{ flex: 1 }}>
              <ComponentsCostByCategoryChart />
            </Box>
          </ChartItem>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: 400 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Item sx={{ flex: 1, minHeight: 300 }}>
            <SectionTitle>Кількість компонентів за категоріями</SectionTitle>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ComponentsCountPieChart />
            </Box>
          </Item>

          <Item sx={{ flex: 1, minHeight: 100 }}>
            <BrokenComponentsCostSparkLine />
          </Item>

          <Item sx={{ flex: 1, minHeight: 100 }}>
            <BrokenComponentsCountSparkLine />
          </Item>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default DashboardResponsive;

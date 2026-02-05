import React, { memo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useTheme } from '../../context/useTheme';
import ComponentsCostByCategoryChart from './ComponentsCostByCategoryChart';
import ComponentsCountPieChart from './ComponentsCountPieChart';
import ComponentsCostSparkLine from './SparkLineCard/ComponentsCostSparkLine';
import ComponentsCountSparkLine from './SparkLineCard/ComponentsCountSparkLine';
import BrokenComponentsCountSparkLine from './SparkLineCard/BrokenComponentsCountSparkLine';
import BrokenComponentsCostSparkLine from './SparkLineCard/BrokenComponentsCostSparkLine';

const Item = memo(({ children, sx }) => {
  const { isDarkMode } = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: isDarkMode
          ? 'rgba(8, 39, 59, 0.35)'
          : '#ffffff',
        color: isDarkMode
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(0, 0, 0, 0.87)',
        backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isDarkMode ? 'blur(12px)' : 'none',
        boxShadow: isDarkMode
          ? '0 8px 32px rgba(8, 39, 59, 0.45)'
          : '0 2px 8px rgba(0, 0, 0, 0.12)',
        border: isDarkMode
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.12)',
        ...sx,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
});

const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      mb: 2,
      fontSize: 18,
      fontWeight: 500,
      }}
  >
    {children}
  </Typography>
);

const DashboardResponsive = () => {
  return (
    <PageWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          width: '100%',
          gap: 1,
          overflowY: 'auto',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1, width: '100%' }}
          >
            <Item sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCostSparkLine />
            </Item>

            <Item sx={{ flex: 1, minHeight: 100 }}>
              <ComponentsCountSparkLine />
            </Item>
          </Box>

          <Item sx={{ flex: 1 }}>
            <SectionTitle>Вартість компонентів за категоріями</SectionTitle>
            <Box sx={{ flex: 1 }}>
              <ComponentsCostByCategoryChart />
            </Box>
          </Item>
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

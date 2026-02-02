import React, { memo } from 'react';
import { Box, Paper, Typography } from '@mui/material';

import ComponentsCostByCategoryChart from './ComponentsCostByCategoryChart';
import ComponentsCountPieChart from './ComponentsCountPieChart';
import ComponentsCostSparkLine from './SparkLineCard/ComponentsCostSparkLine';
import ComponentsCountSparkLine from './SparkLineCard/ComponentsCountSparkLine';
import BrokenComponentsCountSparkLine from './SparkLineCard/BrokenComponentsCountSparkLine';
import BrokenComponentsCostSparkLine from './SparkLineCard/BrokenComponentsCostSparkLine';

const Item = memo(({ children, sx }) => (
  <Paper
    elevation={3}
    sx={{
      p: 1.5,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: 2,
      ...sx,
    }}
  >
    {children}
  </Paper>
));

const SectionTitle = ({ children }) => (
  <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 500, color: '#333' }}>
    {children}
  </Typography>
);

const DashboardResponsive = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        bgcolor: '#fff',
        gap: 1,
        p: 1,
      }}
    >
      {/* Ліва частина */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Верхні спарклайни */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1,
            width: '100%',
          }}
        >
          <Item sx={{ flex: 1, minHeight: 100 }}>
            <ComponentsCostSparkLine />
          </Item>

          <Item sx={{ flex: 1, minHeight: 100 }}>
            <ComponentsCountSparkLine />
          </Item>
        </Box>

        {/* Основний графік вартості*/}
        <Item sx={{ flex: 1, minHeight: 300 }}>
          <SectionTitle>Вартість компонентів за категоріями</SectionTitle>
          <Box sx={{ flex: 1 }}>
            <ComponentsCostByCategoryChart />
          </Box>
        </Item>
      </Box>

      {/* Права частина */}
      <Box
        sx={{
          width: { xs: '100%', lg: 400 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Pie chart */}
        <Item sx={{ flex: 1, minHeight: 300 }}>
          <SectionTitle>Кількість компонентів за категоріями</SectionTitle>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ComponentsCountPieChart />
          </Box>
        </Item>

        {/* Broken компоненти */}
        <Item sx={{ flex: 1, minHeight: 100 }}>
          <BrokenComponentsCostSparkLine />
        </Item>

        <Item sx={{ flex: 1, minHeight: 100 }}>
          <BrokenComponentsCountSparkLine />
        </Item>
      </Box>
    </Box>
  );
};

export default DashboardResponsive;

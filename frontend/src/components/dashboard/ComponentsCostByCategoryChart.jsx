import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDashboardStore } from '@store/useDashboardStore';
import { useCategoriesMap } from '../../hooks/useCategoriesMap';
import { useComponentsStore } from '@store/useComponentsStore';

const ComponentsCostByCategoryChart = React.memo(() => {
  const categoriesMapRaw = useCategoriesMap();
  const categoriesMap = categoriesMapRaw ?? new Map();
  const { components } = useComponentsStore();
  const { statistics } = useDashboardStore();

  const categoryCosts = React.useMemo(() => {
    if (!components.length || !categoriesMap.size || !statistics[0]) {
      return [];
    }

    const counts = components.reduce((acc, component) => {
      const categoryId = String(component.categoryId);
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});

    const totalComponents = components.length;
    const totalCost = statistics[0].totalComponentsCost;

    return Object.entries(counts)
      .map(([categoryId, count]) => {
        const proportion = count / totalComponents;
        const categoryCost = Math.round(totalCost * proportion);
        
        return {
          category: (categoriesMap.get(categoryId) || 'Без категорії').slice(0, 25),
          totalCost: categoryCost
        };
      })
      .filter(item => item.totalCost > 0)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);
  }, [components, categoriesMap, statistics]);

  const valueFormatter = (value) => `${value.toLocaleString()} ₴`;

  if (categoryCosts.length === 0) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 390, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 1
      }}>
        <Typography color="rgba(255, 255, 255, 0.7)">
          Завантаження даних...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 390 }}>
      <BarChart
        height={390}
        dataset={categoryCosts}
        xAxis={[
          {
            dataKey: 'category',
            scaleType: 'band',
            tickPlacement: 'middle',
            tickLabelPlacement: 'middle',
            tickLabelStyle: { 
              fontSize: 15, 
              fill: 'white',
              textAnchor: 'middle'
            },
            tickLabelRotation: 0,
          },
        ]}
        yAxis={[
          {
            label: 'Загальна вартість (₴)',
            width: 110,
            labelStyle: { fontSize: 16, },
            tickLabelStyle: { fontSize: 14,},
          },
        ]}
        series={[
          {
            dataKey: 'totalCost',
            valueFormatter,
            color: '#841a1c',
            highlightScope: { stroke: '#b71c1c' },
          },
        ]}
        legend={{ visible: false }}
        sx={{
          backgroundColor: 'transparent',
          '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.3)' },
          '& .MuiChartsAxis-tickLabel': { fill: 'white' },
        }}
      />
    </Box>
  );
});

export default ComponentsCostByCategoryChart;

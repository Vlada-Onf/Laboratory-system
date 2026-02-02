import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';

const componentsCountDataset = [
  { category: 'Транзистори', count: 24 },
  { category: 'Мікросхеми', count: 57 },
  { category: 'Модулі', count: 39 },
  { category: 'Двигуни', count: 18 },
];

const COLORS = ['#08273b', '#f16731', '#f8f53b', '#d32f2f'];

const ComponentsCountPieChart = React.memo(function ComponentsCountPieChart() {
  const pieData = React.useMemo(
    () =>
      componentsCountDataset.map((item, index) => ({
        id: index,
        label: item.category,
        value: item.count,
        color: COLORS[index % COLORS.length],
      })),
    []
  );

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <PieChart
        width={220}
        height={220}
        series={[
          {
            data: pieData,
            valueFormatter: (datum) => `${datum.value} шт.`,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: {
              innerRadius: 40,
              additionalRadius: -20,
              color: '#e0e0e0',
            },
          },
        ]}
      />
    </Box>
  );
});

export default ComponentsCountPieChart;

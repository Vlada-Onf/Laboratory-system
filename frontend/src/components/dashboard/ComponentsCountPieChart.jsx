import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';

const componentsCountDataset = [
  { category: 'Транзистори', count: 24 },
  { category: 'Мікросхеми', count: 57 },
  { category: 'Модулі', count: 39 },
  { category: 'Двигуни', count: 18 },
];

const COLORS = ['#5bc522', '#f16731', '#f8f53b', '#d32f2f'];

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
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PieChart
        width={200}
        height={200}
        series={[
          {
            data: pieData,
            valueFormatter: (datum) => `${datum.value} шт.`,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: {
              innerRadius: 40,
              additionalRadius: -20,
            },
            labelStyle: {
              fontSize: 14,
              fontWeight: 500,
            },
          },
        ]}
        legend={{ visible: false }}
        slotProps={{ legend: { style: { display: 'none' } } }}
      />

      <Stack direction="column" spacing={1}>
        {pieData.map((item) => (
          <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: item.color,
                borderRadius: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {item.label} ({item.value})
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
});

export default ComponentsCountPieChart;

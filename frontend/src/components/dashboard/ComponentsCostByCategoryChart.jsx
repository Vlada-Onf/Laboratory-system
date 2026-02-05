import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';

const componentsCostDataset = [
  { category: 'Транзистори', totalCost: 12400 },
  { category: 'Мікросхеми', totalCost: 28750 },
  { category: 'Модулі', totalCost: 19300 },
  { category: 'Двигуни', totalCost: 34100 },
];

const valueFormatter = (value) => `${value.toLocaleString()} ₴`;

export default function ComponentsCostByCategoryChart() {
  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
      height={390}
        dataset={componentsCostDataset}
        xAxis={[
          {
            dataKey: 'category',
            scaleType: 'band',
            tickPlacement: 'middle',
            tickLabelPlacement: 'middle',
            tickLabelStyle: {fontSize: 17 },
          },

        ]}
        yAxis={[
          {
            label: 'Загальна вартість (₴)',
            width: 120,
            labelStyle: { fontSize: 17 },
            tickLabelStyle: { fontSize: 15 },
          },
        ]}
        series={[
          {
            dataKey: 'totalCost',
            valueFormatter,
            color: '#841a1c',
          },
        ]}
        legend={{ visible: false }}
      />
    </Box>
  );
}

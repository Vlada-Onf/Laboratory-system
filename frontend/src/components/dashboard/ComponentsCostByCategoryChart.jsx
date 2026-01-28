import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const componentsCostDataset = [
  { category: 'Транзистори', totalCost: 12400 },
  { category: 'Мікросхеми', totalCost: 28750 },
  { category: 'Модулі', totalCost: 19300 },
  { category: 'Двигуни', totalCost: 34100 },
];

const valueFormatter = (value) => `${value.toLocaleString()} ₴`;

export default function ComponentsCostByCategoryChart() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={componentsCostDataset}
        xAxis={[
          {
            dataKey: 'category',
            scaleType: 'band',
            tickPlacement: 'middle',
            tickLabelPlacement: 'middle',
          },
        ]}
        yAxis={[
          {
            label: 'Загальна вартість (₴)',
            width: 100,
          },
        ]}
        series={[
          {
            dataKey: 'totalCost',
            label: 'Вартість компонентів',
            valueFormatter,
            color: '#841a1c',
          },
        ]}
        height={350}
        margin={{ left: 20 }}
        slotProps={{
          axisTickLabel: {
            style: {
              fontSize: 17,
              fill: '#333',
            },
          },
        }}
      />
    </div>
  );
}

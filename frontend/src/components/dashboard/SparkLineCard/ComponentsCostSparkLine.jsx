import React from 'react';
import SparkLineCard from './SparkLineCard';

const componentCosts = [
  { week: '01-07 Січня', value: 1200 },
  { week: '08-14 Січня', value: 1450 },
  { week: '15-21 Січня', value: 1320 },
  { week: '22-28 Січня', value: 1600 },
  { week: '29 Січня-04 Лютого', value: 1750 },
];

const weeks = componentCosts.map((item) => item.week);
const costs = componentCosts.map((item) => item.value);

export default function ComponentsCostSparkLine() {
  return (
    <SparkLineCard
      data={costs}
      labels={weeks}
      title="Вартість компонентів"
      lineColor="#f16731"
      valueType="currency"
    />
  );
}

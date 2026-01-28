import React from 'react';
import SparkLineCard from './SparkLineCard';

const brokenCostsData = [
  { week: '01-07 Січня', value: 50 },
  { week: '08-14 Січня', value: 80 },
  { week: '15-21 Січня', value: 60 },
  { week: '22-28 Січня', value: 70 },
  { week: '29 Січня-04 Лютого', value: 90 },
];

const weeks = brokenCostsData.map(item => item.week);
const costs = brokenCostsData.map(item => item.value);

export default function BrokenComponentsCostSparkLine() {
  return (
    <SparkLineCard
      data={costs}
      labels={weeks}
      title="Вартість браку"
      lineColor="#f8f53b"
      valueType="currency"
    />
  );
}

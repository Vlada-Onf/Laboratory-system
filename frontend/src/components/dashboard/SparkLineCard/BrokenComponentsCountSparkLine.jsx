import React from 'react';
import SparkLineCard from './SparkLineCard';

const brokenCountsData = [
  { week: '01-07 Січня', value: 5 },
  { week: '08-14 Січня', value: 8 },
  { week: '15-21 Січня', value: 6 },
  { week: '22-28 Січня', value: 7 },
  { week: '29 Січня-04 Лютого', value: 9 },
];

const weeks = brokenCountsData.map(item => item.week);
const counts = brokenCountsData.map(item => item.value);

export default function BrokenComponentsCountSparkLine() {
  return (
    <SparkLineCard
      data={counts}
      labels={weeks}
      title="Кількість браку"
      lineColor="#d32f2f"
    />
  );
}

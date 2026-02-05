import React from 'react';
import SparkLineCard from './SparkLineCard';

const componentCounts = [
  { week: '01-07 Січня', value: 120 },
  { week: '08-14 Січня', value: 115 },
  { week: '15-21 Січня', value: 113 },
  { week: '22-28 Січня', value: 112 },
  { week: '29 Січня-04 Лютого', value: 100 },
];

const weeks = componentCounts.map((item) => item.week);
const counts = componentCounts.map((item) => item.value);


export default function ComponentsCountSparkLine() {
  return (
    <SparkLineCard
      data={counts}
      labels={weeks}
      title="Кількість компонентів"
      lineColor="#5bc522"
    />
  );
}

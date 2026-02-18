import React, { useMemo } from 'react';
import SparkLineCard from './SparkLineCard';
import { useDashboardStore } from '@store/useDashboardStore';

export default function BrokenComponentsCostSparkLine() {
  const { statistics } = useDashboardStore();
  
  const data = useMemo(() =>
    statistics.map(stat =>
      Math.round((stat.totalComponentsCost || 0) * 0.1)
    ).reverse(), 
    [statistics]
  );

  const labels = useMemo(() =>
    statistics.map(stat => {
      const date = new Date(stat.statisticDate);
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short'
      });
    }).reverse(),
    [statistics]
  );

  return (
    <SparkLineCard
      data={data}
      labels={labels}
      title="Вартість браку"
      lineColor="#f8f53b"
      valueType="currency"
    />
  );
}

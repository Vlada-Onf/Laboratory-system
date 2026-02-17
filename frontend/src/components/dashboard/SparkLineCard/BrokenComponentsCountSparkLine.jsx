import React, { useMemo } from 'react';
import SparkLineCard from './SparkLineCard';
import { useDashboardStore } from '@store/useDashboardStore';

export default function BrokenComponentsCountSparkLine() {
  const { statistics } = useDashboardStore();
  
  const data = useMemo(() => 
    statistics.map(stat => stat.totalDecommissionedCount || 0).reverse(), 
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
      title="Кількість браку"
      lineColor="#d32f2f"
      valueType="number"
    />
  );
}

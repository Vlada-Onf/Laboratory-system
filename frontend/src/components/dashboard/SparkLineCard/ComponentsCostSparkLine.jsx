import SparkLineCard from './SparkLineCard';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { useMemo } from 'react';
import { useEffect } from 'react';

const ComponentsCostSparkLine = () => {
  const { statistics, fetchDashboardStatistics, isLoading } = useDashboardStore();
  
  useEffect(() => {
    fetchDashboardStatistics();
  }, [fetchDashboardStatistics]);

  const data = useMemo(() => 
    statistics.map(stat => stat.totalComponentsCost || 0).reverse(), 
    [statistics]
  );
  
  const labels = useMemo(() => 
    statistics.map(stat => {
      const date = new Date(stat.statisticDate);
      return date.toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' });
    }).reverse(), 
    [statistics]
  );

  return (
    <SparkLineCard
      data={data}
      labels={labels}
      title="Загальна вартість"
      lineColor="#841a1c"
      valueType="currency"
      loading={isLoading}
    />
  );
};

export default ComponentsCostSparkLine;

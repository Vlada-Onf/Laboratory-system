import SparkLineCard from './SparkLineCard';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { useMemo } from 'react';

const ComponentsCountSparkLine = () => {
  const { statistics, isLoading } = useDashboardStore();
  
  const data = useMemo(() => 
    statistics.map(stat => stat.totalComponentsCount || 0).reverse(), 
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
      title="Кількість компонентів"
      lineColor="#5bc522"
      valueType="number"
      loading={isLoading}
    />
  );
};

export default ComponentsCountSparkLine;

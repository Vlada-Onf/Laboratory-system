import { useEffect } from 'react';
import { useDashboardStore } from '@store/useDashboardStore';
import { useComponentsStore } from '@store/useComponentsStore';

export const useDashboardData = () => {
  const { fetchDashboardStatistics, createStatistic } = useDashboardStore();
  const { fetchComponents } = useComponentsStore();

  useEffect(() => {
    fetchDashboardStatistics();
    fetchComponents();
  }, [fetchDashboardStatistics, fetchComponents]);

  const handleRefreshStatistics = async () => {
    try {
      const todayISO = new Date().toISOString();
      await createStatistic(todayISO);
      await fetchComponents();
    } catch (error) {
      console.error('Помилка оновлення:', error);
    }
  };

  return { handleRefreshStatistics };
};

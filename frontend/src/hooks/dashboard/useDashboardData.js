import { useEffect } from 'react';
import { useDashboardStore } from '@store/useDashboardStore';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesStore } from '@store/useCategoriesStore'; 

export const useDashboardData = () => {
  const { fetchDashboardStatistics, createStatistic } = useDashboardStore();
  const { fetchComponents } = useComponentsStore();
  const { fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
    fetchComponents();
    fetchDashboardStatistics();
  }, [fetchCategories, fetchComponents, fetchDashboardStatistics]);

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

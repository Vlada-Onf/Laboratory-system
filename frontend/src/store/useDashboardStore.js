import { create } from 'zustand';
import apiClient from '../api/client';

export const useDashboardStore = create((set, get) => ({
  statistics: [],
  isLoading: false,
  decommissionedStats: [],

  fetchDashboardStatistics: async () => {
    console.log('Fetching dashboard statistics...');
    set({ isLoading: true });

    try {
      const { data } = await apiClient.get('/dashboard-statistics');

      const sortedStats = (data || []).sort((a, b) =>
        new Date(b.statisticDate) - new Date(a.statisticDate)
      );

      set({
        statistics: sortedStats,
        decommissionedStats: sortedStats.map(stat => stat.totalDecommissionedCount || 0)
      });

    } catch (error) {
      console.error('Dashboard stats error:', error.response?.data || error);
      set({ statistics: [], decommissionedStats: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshStatistics: async () => {
    await get().fetchDashboardStatistics();
  },
  createStatistic: async (date) => {
    try {
      console.log('Creating statistic for date:', date);
      const { data } = await apiClient.post('/dashboard-statistics', {
        statisticDate: date
      });
      await get().fetchDashboardStatistics();
      return data;
    } catch (error) {
      console.error('Create statistic error:', error.response?.data || error);
      throw error;
    }
  },

  clearStatistics: () => {
    set({ statistics: [], decommissionedStats: [], isLoading: false });
  },

  getLatestStatistic: () => {
    const { statistics } = get();
    return statistics[0] || null;
  }
}));

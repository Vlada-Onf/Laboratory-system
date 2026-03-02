import { create } from 'zustand';
import apiClient from '../api/client';

export const useRecentHistoryStore = create((set) => ({
  recentHistory: [],
  isLoading: false,

  fetchRecentHistory: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/history/recent?limit=4');
      set({ recentHistory: response.data || [] });
    } catch (error) {
      console.error('Recent history error:', error);
      set({ recentHistory: [] });
    } finally {
      set({ isLoading: false });
    }
  }
}));

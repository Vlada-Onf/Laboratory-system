import { create } from 'zustand';
import apiClient from '../api/client';

export const useWishlistStatusesStore = create((set, get) => ({
  statuses: [],
  isLoading: false,
  
  fetchStatuses: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/wishlist-statuses');
      set({ statuses: data || [] });
    } catch (error) {
      console.error('Помилка завантаження статусів:', error);
      set({ statuses: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addStatus: async (statusData) => {
    try {
      const { data } = await apiClient.post('/wishlist-statuses', statusData);
      set((state) => ({ statuses: [...state.statuses, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання статусу:', error);
      throw error;
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const { data } = await apiClient.put(`/wishlist-statuses/${id}`, statusData);
      set((state) => ({
        statuses: state.statuses.map(status => 
          status.id === id ? data : status
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення статусу:', error);
      throw error;
    }
  },

  deleteStatus: async (id) => {
    try {
      await apiClient.delete(`/wishlist-statuses/${id}`);
      set((state) => ({
        statuses: state.statuses.filter(status => status.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення статусу:', error);
      throw error;
    }
  }
}));

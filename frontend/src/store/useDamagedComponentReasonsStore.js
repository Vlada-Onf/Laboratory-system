import { create } from 'zustand';
import apiClient from '../api/client';

export const useDamagedComponentReasonsStore = create((set, get) => ({
  reasons: [],
  isLoading: false,
  
  fetchReasons: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/damaged-component-reasons');
      set({ reasons: data || [] });
    } catch (error) {
      console.error('Помилка завантаження причин зламаних компонентів:', error);
      set({ reasons: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addReason: async (reasonData) => {
    try {
      const { data } = await apiClient.post('/damaged-component-reasons', reasonData);
      set((state) => ({ reasons: [...state.reasons, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання причини:', error);
      throw error;
    }
  },

  updateReason: async (id, reasonData) => {
    try {
      const { data } = await apiClient.put(`/damaged-component-reasons`, reasonData);
      set((state) => ({
        reasons: state.reasons.map(reason => 
          reason.id === id ? data : reason
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення причини:', error);
      throw error;
    }
  },

  deleteReason: async (id) => {
    try {
      await apiClient.delete(`/damaged-component-reasons/${id}`);
      set((state) => ({
        reasons: state.reasons.filter(reason => reason.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення причини:', error);
      throw error;
    }
  }
}));

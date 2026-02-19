import { create } from 'zustand';
import apiClient from '../api/client';

export const useNeedStatusesStore = create((set, get) => ({
  statuses: [],
  isLoading: false,

  fetchStatuses: async () => {
  const { statuses, isLoading } = get();
  if (isLoading || statuses.length > 0){
    return;
  }

  set({ isLoading: true });
  try {
    const { data } = await apiClient.get('/need-statuses');
    set({ statuses: data || [] });
  } catch (error) {
    console.error('Помилка завантаження статусів потреб:', error);
    set({ statuses: [] });
  } finally {
    set({ isLoading: false });
  }
},


  addStatus: async (statusData) => {
    try {
      const { data } = await apiClient.post('/need-statuses', statusData);
      set((state) => ({ statuses: [...state.statuses, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання статусу потреби:', error);
      throw error;
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const { data } = await apiClient.put(`/need-statuses`, statusData);
      set((state) => ({
        statuses: state.statuses.map(status => 
          status.id === id ? data : status
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення статусу потреби:', error);
      throw error;
    }
  },

  deleteStatus: async (id) => {
    try {
      await apiClient.delete(`/need-statuses/${id}`);
      set((state) => ({
        statuses: state.statuses.filter(status => status.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення статусу потреби:', error);
      throw error;
    }
  }
}));

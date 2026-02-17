import { create } from 'zustand';
import apiClient from '../api/client';

export const useActionsStore = create((set, get) => ({
  actions: [],
  isLoading: false,

  fetchActions: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/actions');
      set({ actions: data || [] });
    } catch (error) {
      console.error('Помилка завантаження дій:', error);
      set({ actions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addAction: async (actionData) => {
    try {
      const { data } = await apiClient.post('/actions', actionData);
      set((state) => ({ actions: [...state.actions, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання дії:', error);
      throw error;
    }
  },

  updateAction: async (id, actionData) => {
    try {
      const { data } = await apiClient.put('/actions', actionData);
      set((state) => ({
        actions: state.actions.map(action => 
          action.id === id ? data : action
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення дії:', error);
      throw error;
    }
  },

  deleteAction: async (id) => {
    try {
      await apiClient.delete(`/actions/${id}`);
      set((state) => ({
        actions: state.actions.filter(action => action.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення дії:', error);
      throw error;
    }
  }
}));

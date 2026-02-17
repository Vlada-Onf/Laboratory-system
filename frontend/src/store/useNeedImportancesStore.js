import { create } from 'zustand';
import apiClient from '../api/client';

export const useNeedImportancesStore = create((set, get) => ({
  importances: [],
  isLoading: false,
  
  fetchImportances: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/need-importances');
      set({ importances: data || [] });
    } catch (error) {
      console.error('Помилка завантаження рівнів важливості потреб:', error);
      set({ importances: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addImportance: async (importanceData) => {
    try {
      const { data } = await apiClient.post('/need-importances', importanceData);
      set((state) => ({ importances: [...state.importances, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання рівня важливості потреби:', error);
      throw error;
    }
  },

  updateImportance: async (id, importanceData) => {
    try {
      const { data } = await apiClient.put(`/need-importances`, importanceData);
      set((state) => ({
        importances: state.importances.map(imp => 
          imp.id === id ? data : imp
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення рівня важливості потреби:', error);
      throw error;
    }
  },

  deleteImportance: async (id) => {
    try {
      await apiClient.delete(`/need-importances/${id}`);
      set((state) => ({
        importances: state.importances.filter(imp => imp.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення рівня важливості потреби:', error);
      throw error;
    }
  }
}));

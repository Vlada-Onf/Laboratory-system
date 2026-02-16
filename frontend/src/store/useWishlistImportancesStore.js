import { create } from 'zustand';
import apiClient from '../api/client';

export const useWishlistImportancesStore = create((set, get) => ({
  importances: [],
  isLoading: false,
  
  fetchImportances: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/wishlist-importances');
      set({ importances: data || [] });
    } catch (error) {
      console.error('Помилка завантаження рівнів важливості:', error);
      set({ importances: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addImportance: async (importanceData) => {
    try {
      const { data } = await apiClient.post('/wishlist-importances', importanceData);
      set((state) => ({ importances: [...state.importances, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання рівня важливості:', error);
      throw error;
    }
  },

  updateImportance: async (id, importanceData) => {
    try {
      const { data } = await apiClient.put(`/wishlist-importances/${id}`, importanceData);
      set((state) => ({
        importances: state.importances.map(imp => 
          imp.id === id ? data : imp
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення рівня важливості:', error);
      throw error;
    }
  },

  deleteImportance: async (id) => {
    try {
      await apiClient.delete(`/wishlist-importances/${id}`);
      set((state) => ({
        importances: state.importances.filter(imp => imp.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення рівня важливості:', error);
      throw error;
    }
  }
}));

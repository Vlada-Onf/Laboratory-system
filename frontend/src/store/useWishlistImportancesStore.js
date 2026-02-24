import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useWishlistImportancesStore = create((set, get) => ({
  importances: [],
  isLoading: false,
  
  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  fetchImportances: async () => {
    const { importances, isLoading } = get();
    if (isLoading || importances.length > 0) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/wishlist-importances');
      set({ importances: data || [] });
    } catch (error) {
      console.error('Помилка завантаження пріоритетів:', error);
      set({ importances: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  resetImportances: () => set({ importances: [], isLoading: false }),

  addImportance: async (importanceData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        ...importanceData,
        performedBy: userId
      };

      console.log('POST /wishlist-importances:', dataWithUser);
      const { data } = await apiClient.post('/wishlist-importances', dataWithUser);
      set((state) => ({ importances: [...state.importances, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання рівня важливості:', error.response?.data);
      throw error;
    }
  },

  updateImportance: async (id, importanceData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        id,
        ...importanceData,
        performedBy: userId
      };

      console.log('PUT /wishlist-importances:', dataWithUser);
      const { data } = await apiClient.put(`/wishlist-importances`, dataWithUser);
      
      set((state) => ({
        importances: state.importances.map(imp => 
          imp.id === id ? data : imp
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення рівня важливості:', error.response?.data);
      throw error;
    }
  },

  deleteImportance: async (id) => {
    set({ isLoading: true });

    try {
      const userId = get().getCurrentUserId();
      if (!userId) {
        throw new Error('Потрібен авторизований користувач');
      }

      const url = `/wishlist-importances/${id}?performedBy=${userId}`;
      
      console.log('DELETE URL:', url);

      await apiClient.delete(url);

      set((state) => ({
        importances: state.importances.filter(imp => imp.id !== id)
      }));


    } catch (error) {
      console.error('Delete failed:', error);

      if ([404, 500].includes(error.response?.status)) {
        set((state) => ({
          importances: state.importances.filter(imp => imp.id !== id)
        }));
        console.log('Backend error, локально видалено');
        return;
      }

      get().fetchImportances();
      throw error;

    } finally {
      set({ isLoading: false });
    }
  }
}));

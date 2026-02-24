import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useNeedImportancesStore = create((set, get) => ({
  importances: [],
  isLoading: false,

  fetchImportances: async () => {
    const { importances, isLoading } = get();
    if (isLoading || importances.length > 0) return;

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

  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  addImportance: async (importanceData) => {
    try {
      set({ isLoading: true });

      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        ...importanceData,
        performedBy: userId
      };

      console.log('POST /need-importances:', dataWithUser);
      const { data } = await apiClient.post('/need-importances', dataWithUser);
      set((state) => ({
        importances: [...state.importances, data]
      }));

      return data;
    } catch (error) {
      console.error('Помилка додавання рівня важливості:', error.response?.data);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateImportance: async (id, importanceData) => {
    try {
      set({ isLoading: true });

      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        id,
        ...importanceData,
        performedBy: userId
      };

      console.log('PUT /need-importances:', dataWithUser);
      const { data } = await apiClient.put('/need-importances', dataWithUser);
      set((state) => ({
        importances: state.importances.map((imp) =>
          imp.id === id ? data : imp
        )
      }));

      return data;
    } catch (error) {
      console.error('Помилка оновлення рівня важливості:', error.response?.data);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteImportance: async (id) => {
    set({ isLoading: true });

    try {
      const userId = get().getCurrentUserId();
      if (!userId) {
        throw new Error('Потрібен авторизований користувач');
      }

      const url = `/need-importances/${id}?performedBy=${userId}`;
      
      await apiClient.delete(url);

      set((state) => ({
        importances: state.importances.filter((imp) => imp.id !== id)
      }));


    } catch (error) {
      console.error('Delete failed:', error);

      if ([404, 500].includes(error.response?.status)) {
        set((state) => ({
          importances: state.importances.filter((imp) => imp.id !== id)
        }));
        console.log('Backend error, локально видалено');
        return;
      }

      get().fetchImportances();
      throw error;

    } finally {
      set({ isLoading: false });
    }
  },

  updateNeedImportance: async (needId, importanceId, reason = '') => {
    try {
      set({ isLoading: true });

      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібна авторизація');

      const { data } = await apiClient.put('/needs/importance', {
        id: needId,
        importanceId,
        performedBy: userId,
        reason
      });

      return data;
    } catch (error) {
      console.error('Помилка оновлення пріоритету потреби:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

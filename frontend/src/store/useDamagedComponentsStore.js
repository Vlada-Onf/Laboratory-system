import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useDamagedComponentsStore = create((set, get) => ({
  damagedComponents: [],
  isLoading: false,

  getCurrentUserId: () => useProfileStore.getState().profile?.id || null,

  fetchDamagedComponents: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/damaged-components');
      set({ damagedComponents: data || [] });
    } catch (error) {
      console.error('[DAMAGED] API ERROR:', error.response?.data || error);
      set({ damagedComponents: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addDamagedComponent: async (componentId, reasonId, quantity) => {
    const userId = get().getCurrentUserId();
    if (!userId) throw new Error('Авторизуйтесь для запису пошкоджень!');

    const damagedData = {
      componentId,
      reasonId,
      quantity: Number(quantity) || 0,
      recordedBy: userId,
      performedBy: userId
    };

    try {
      const { data } = await apiClient.post('/damaged-components', damagedData);
      set((state) => ({
        damagedComponents: [data, ...state.damagedComponents]
      }));
      return data;
    } catch (error) {
      console.error('[DAMAGED] ERROR:', {
        status: error.response?.status,
        dataSent: damagedData
      });
      throw error;
    }
  },

  updateDamagedComponent: async (id, componentId, reasonId, quantity) => {
    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Авторизуйтесь для редагування!');
    }

    const updateData = {
      id,
      componentId,
      reasonId,
      quantity: Number(quantity) || 0,
      updatedBy: userId,
      performedBy: userId
    };

    try {
      const { data } = await apiClient.put('/damaged-components', updateData);
      set((state) => ({
        damagedComponents: state.damagedComponents.map(item =>
          item.id === id ? data : item
        )
      }));
      return data;
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      throw error;
    }
  },

  deleteDamagedComponent: async (id) => {
    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Авторизуйтесь для видалення!');
    }

    try {
      const url = `/damaged-components/${id}?deletedBy=${userId}`;
      await apiClient.delete(url);
    } catch (error) {
      if (error.response?.status === 500) {
        console.log('Backend 500 = deleted, only logging failed');
      } else {
        throw error;
      }
    }

    set((state) => ({
      damagedComponents: state.damagedComponents.filter(item => item.id !== id)
    }));
  },
}));

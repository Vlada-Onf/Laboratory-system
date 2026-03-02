import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

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
      const profileStore = useProfileStore.getState();
      const currentUserId = profileStore.profile?.id;

      if (!currentUserId) {
        throw new Error('Потрібна авторизація');
      }

      const payload = {
        name: reasonData.name,
        description: reasonData.description || '',
        performedBy: currentUserId
      };

      const { data } = await apiClient.post('/damaged-component-reasons', payload);
      set((state) => ({ reasons: [...state.reasons, data] }));
      return data;
    } catch (error) {
      console.error('CREATE ERROR:', error.response?.data);
      throw error;
    }
  },

  updateReason: async (id, reasonData) => {
    try {
      const profileStore = useProfileStore.getState();
      const currentUserId = profileStore.profile?.id;

      if (!currentUserId) {
        throw new Error('Потрібна авторизація');
      }

      const payload = {
        id,
        name: reasonData.name,
        description: reasonData.description || '',
        performedBy: currentUserId
      };


      const { data } = await apiClient.put(`/damaged-component-reasons`, payload);
      set((state) => ({
        reasons: state.reasons.map(reason => 
          reason.id === id ? data : reason
        )
      }));
      console.log('UPDATE reason:', data);
      return data;
    } catch (error) {
      console.error('UPDATE ERROR:', error.response?.data);
      throw error;
    }
  },

 deleteReason: async (id) => {
  const profileStore = useProfileStore.getState();
  const currentUserId = profileStore.profile?.id;

  try {
    await apiClient.delete(`/damaged-component-reasons/${id}?performedBy=${currentUserId}`);
  } catch (error) {
    if (error.response?.status === 500) {
      console.log('500 = Backend logging fail, record deleted');
    } else {
      throw error;
    }
  }

  set((state) => state.reasons.filter(r => r.id !== id));
}


}));
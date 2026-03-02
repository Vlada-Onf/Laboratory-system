import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useNeedStatusesStore = create((set, get) => ({
  statuses: [],
  isLoading: false,

  fetchStatuses: async () => {
    const { statuses, isLoading } = get();
    if (isLoading || statuses.length > 0) return;

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
  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  addStatus: async (statusData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        ...statusData,
        performedBy: userId
      };

      console.log('POST /need-statuses:', dataWithUser);
      const { data } = await apiClient.post('/need-statuses', dataWithUser);
      set((state) => ({ statuses: [...state.statuses, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання статусу:', error.response?.data);
      throw error;
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        id,
        ...statusData,
        performedBy: userId
      };

      console.log('PUT /need-statuses/:id:', dataWithUser);
      const { data } = await apiClient.put(`/need-statuses`, dataWithUser);
      set((state) => ({
        statuses: state.statuses.map(status => 
          status.id === id ? data : status
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення статусу:', error.response?.data);
      throw error;
    }
  },

  deleteStatus: async (id) => {
  set({ isLoading: true });

  try {
    const userId = get().getCurrentUserId();
    if (!userId) {
      throw new Error('Потрібен авторизований користувач');
    }

    const url = `/need-statuses/${id}?performedBy=${userId}`;

    console.log('DELETE URL:', url);

    await apiClient.delete(url);

    set((state) => ({
      statuses: state.statuses.filter(status => status.id !== id)
    }));


  } catch (error) {
    console.error('Delete failed:', error);
    if ([404, 500].includes(error.response?.status)) {
      set((state) => ({
        statuses: state.statuses.filter(status => status.id !== id)
      }));
      console.log('Backend error, локально видалено');
      return;
    }

    get().fetchStatuses();
    throw error;

  } finally {
    set({ isLoading: false });
  }
}
}));

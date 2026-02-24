import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useWishlistStatusesStore = create((set, get) => ({
  statuses: [],
  isLoading: false,
  
  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  fetchStatuses: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/wishlist-statuses');
      set({ statuses: data || [] });
    } catch (error) {
      console.error('Помилка завантаження статусів:', error);
      set({ statuses: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addStatus: async (statusData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        ...statusData,
        performedBy: userId
      };

      console.log('POST /wishlist-statuses:', dataWithUser);
      const { data } = await apiClient.post('/wishlist-statuses', dataWithUser);
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

    const { data } = await apiClient.put(`/wishlist-statuses`, dataWithUser);
    
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
      const url = `/wishlist-statuses/${id}?performedBy=${userId}`;
      
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

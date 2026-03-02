import { create } from 'zustand';
import apiClient from '../api/client';
import { useWishlistImportancesStore } from './useWishlistImportancesStore';
import { useWishlistStatusesStore } from './useWishlistStatusesStore';
import { useProfileStore } from './useProfileStore';

export const useWishlistStore = create((set, get) => ({
  wishlists: [],
  wishlistRows: [],
  isLoading: false,
  importancesLoaded: false,
  statusesLoaded: false,

  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  fetchAllData: async () => {
    set({ isLoading: true });
    try {
      const importancesStore = useWishlistImportancesStore.getState();
      await importancesStore.fetchImportances();
      set({ importancesLoaded: true });

      const statusesStore = useWishlistStatusesStore.getState();
      await statusesStore.fetchStatuses();
      set({ statusesLoaded: true });

      await get().fetchWishlists();
    } catch (error) {
      console.error('Помилка повного завантаження:', error);
      set({ wishlists: [], wishlistRows: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWishlists: async () => {
    try {
      const { data } = await apiClient.get('/wishlists');

      const importancesStore = useWishlistImportancesStore.getState();
      const statusesStore = useWishlistStatusesStore.getState();

      const wishlistRows = data.map((wishlist) => ({
        id: wishlist.id,
        componentId: null,
        componentImage: '',
        categoryId: null,
        category: '—',
        name: wishlist.name || 'Без назви',
        description: wishlist.description || '',
        quantityNeeded: wishlist.quantityNeeded || 1,
        status: statusesStore.statuses?.find(s => s.id === wishlist.statusId)?.name || 'Невідомий',
        statusId: wishlist.statusId,
        priority: importancesStore.importances?.find(i => i.id === wishlist.importanceId)?.name || 'Низька',
        importanceId: wishlist.importanceId,
        requestedAt: wishlist.requestedAt || new Date().toISOString(),
        completionReason: wishlist.completionReason || '—',
        completedAt: wishlist.completedAt || null,
      }));

      set({
        wishlists: data,
        wishlistRows
      });
    } catch (error) {
      console.error('Помилка завантаження wishlists:', error);
      set({ wishlists: [], wishlistRows: [] });
    }
  },

 createWishlist: async (formData) => {
  try {
    const userId = get().getCurrentUserId();
    if (!userId) {
      throw new Error('Потрібен авторизований користувач');
    }

    const payload = {
      name: formData.name?.trim() || '',
      description: formData.description?.trim() || '',
      quantityNeeded: Math.max(Number(formData.quantityNeeded) || 1, 1),
      requestedBy: userId,
      performedBy: userId,
      importanceId: formData.importanceId,
      statusId: formData.statusId,
      request: {
        componentId: formData.componentId || null,
        note: formData.note || ''
      }
    };
    const { data } = await apiClient.post('/wishlists', payload);
    await get().fetchWishlists();
    return data;
  } catch (error) {
    console.error('Помилка створення wishlist:', error.response?.data || error.message);
    throw error;
  }
},

updateWishlistDetails: async (wishlistId, details) => {
  try {
    const userId = get().getCurrentUserId();
    if (!userId) {
      throw new Error('Потрібен авторизований користувач');
    }

    const payload = {
      id: wishlistId,
      name: details.name?.trim() || '',
      description: details.description?.trim() || '',
      quantityNeeded: Math.max(Number(details.quantityNeeded) || 1, 1),
      importanceId: details.importanceId,
      requestedBy: userId,
      performedBy: userId,
    };

    const { data } = await apiClient.put('/wishlists/details', payload);
    await get().fetchWishlists();
    return data;
  } catch (error) {
    console.error('Помилка оновлення деталей wishlist:', error.response?.data || error);
    throw error;
  }
},

  updateWishlistStatus: async (wishlistId, statusId, completionReason) => {
  try {
    const userId = get().getCurrentUserId();
    if (!userId) throw new Error('Потрібен авторизований користувач');

    const payload = {
      id: wishlistId,
      statusId,
      completionReason: completionReason || '',
    };

    const url = `/wishlists/status?performedBy=${userId}`;

    const { data } = await apiClient.put(url, payload);
    await get().fetchWishlists();
    return data;
  } catch (error) {
    console.error('Помилка оновлення статусу wishlist:', error.response?.data || error);
    throw error;
  }
},


  deleteWishlist: async (wishlistId) => {
    set({ isLoading: true });
    try {
      const userId = get().getCurrentUserId();
      if (!userId) {
        throw new Error('Потрібен авторизований користувач');
      }

      const url = `/wishlists/${wishlistId}?performedBy=${userId}`;
      await apiClient.delete(url);
      await get().fetchWishlists();
    } catch (error) {
      console.error('Помилка видалення wishlist:', error);
      if ([404, 500].includes(error.response?.status)) {
        console.log('Backend error, локально видалено');
        await get().fetchWishlists();
        return;
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

import { create } from 'zustand';
import apiClient from '../api/client';
import { useWishlistImportancesStore } from './useWishlistImportancesStore';
import { useWishlistStatusesStore } from './useWishlistStatusesStore';

const USER_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

export const useWishlistStore = create((set, get) => ({
  wishlists: [],
  wishlistRows: [],
  isLoading: false,
  importancesLoaded: false,
  statusesLoaded: false,  

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
      const payload = {
        name: formData.name || "string",
        description: formData.description || "string",
        quantityNeeded: Number(formData.quantity) || 0,
        requestedBy: USER_ID,
        importanceId: formData.importanceId,
        statusId: formData.statusId,
      };

      const { data } = await apiClient.post('/wishlists', payload);
      return data;
    } catch (error) {
      console.error('Помилка створення wishlist:', error.response?.data || error.message);
      throw error;
    }
  },

  updateWishlistDetails: async (wishlistId, details) => {
    try {
      const payload = {
        id: wishlistId,
        name: details.name,
        description: details.description,
        quantityNeeded: Number(details.quantity),
        importanceId: details.importanceId,
      };
      
      const { data } = await apiClient.put('/wishlists/details', payload);
      await get().fetchWishlists();
      return data;
    } catch (error) {
      console.error('Помилка оновлення деталей wishlist:', error);
      throw error;
    }
  },

  updateWishlistStatus: async (wishlistId, statusId, completionReason) => {
    try {
      const payload = {
        id: wishlistId,
        statusId,
        completionReason: completionReason || '',
      };
      
      const { data } = await apiClient.put('/wishlists/status', payload);
      await get().fetchWishlists();
      return data;
    } catch (error) {
      console.error('Помилка оновлення статусу wishlist:', error);
      throw error;
    }
  },

  deleteWishlist: async (wishlistId) => {
    try {
      await apiClient.delete(`/wishlists/${wishlistId}`);
      await get().fetchWishlists();
    } catch (error) {
      console.error('Помилка видалення wishlist:', error);
      throw error;
    }
  },
}));

import { create } from 'zustand';
import apiClient, { setAuthToken } from '../api/client';

export const useBackendAuthStore = create((set, get) => ({
  userId: null,
  isLoaded: false,
  isLoading: false,
  backendUser: null,
  isSynced: false,

  syncWithBackend: async (getTokenFn) => {
    const { isSynced, isLoading } = get();

    if (isSynced) {
      console.log('Already synced, skipping...');
      return get().backendUser;
    }

    if (isLoading) {
      return;
    }

    try {
      console.log('Syncing with backend...');
      set({ isLoading: true });
      setAuthToken(getTokenFn);
      const { data: user } = await apiClient.get('/Auth/me');

      console.log('Backend user:', user);
      set({
        backendUser: user,
        isSynced: true,
        isLoaded: true,
        isLoading: false,
        userId: user.id
      });
      return user;
    } catch (error) {
      console.log('Sync skipped or failed:', error.message);
      set({ isLoaded: true, isLoading: false });
    }
  }
}));
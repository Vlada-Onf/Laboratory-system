import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import apiClient from '../api/client';
import { useAuthStore } from './useAuthStore';
import { useCommentsStore } from './useCommentsStore';

export const useProfileStore = create(
  devtools((set, get) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async () => {
      const { profile, loading } = get();
      if (loading) {
        return;
      }

      if (profile) {
        return profile;
      }

      set({ loading: true, error: null });
      try {
        console.log('FETCHING /me...');
        const { data } = await apiClient.get('/me');
        console.log('PROFILE LOADED:', data);
        set({ profile: data, loading: false });
        return data;
      } catch (error) {
        console.error('FETCH /me FAILED:', error);
        set({
          error: `Profile: ${error.response?.status || error.message}`,
          loading: false
        });
      }
    },

    updateProfile: async (firstName, lastName, file = null) => {
      console.log('updateProfile:', { firstName, lastName, hasFile: !!file });

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      if (file) formData.append('image', file);

      set({ loading: true, error: null });
      try {
        const { data } = await apiClient.put('/me', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        set({ profile: data, loading: false });

        useAuthStore.getState().updateProfile(data);
        useCommentsStore.getState().refreshCurrentUserData(data);
        return data;
      } catch (error) {
        console.error('Backend ERROR:', error.response?.data);
        set({ error: error.response?.data?.message || 'Update failed', loading: false });
        throw error;
      }
    },

    logout: async () => {
      set({ loading: true });
      try {
        await apiClient.post('/me/logout');

        if (window.Clerk) {
          await window.Clerk.signOut({
            redirectUrl: '/sign-in'
          });
        } else {
          window.location.href = '/sign-in';
        }

        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        set({ profile: null, loading: false });
      }
    },

    deactivateAccount: async () => {
      set({ loading: true, error: null });
      try {
        await apiClient.delete('/me');
        set({
          profile: null,
          loading: false,
          error: null
        });

        localStorage.removeItem('token');
        window.location.href = '/login';

        return true;
      } catch (error) {
        console.error('DEACTIVATION FAILED:', error);
        set({
          error: error.response?.data?.message || 'Помилка видалення акаунту',
          loading: false
        });
        return false;
      }
    },

    clearError: () => set({ error: null })
  }),
  { name: 'useProfileStore' }
));
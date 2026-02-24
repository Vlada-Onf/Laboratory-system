import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import apiClient from '../api/client';

export const useAuthStore = create(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    fetchCurrentUser: async () => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiClient.get('/me');
        const token = localStorage.getItem('authToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('ТОЧНА РОЛЬ З JWT:', payload.role || payload.roles);
        console.log('JWT EMAIL:', payload.email || payload.sub);
        console.log('JWT EXP:', new Date(payload.exp * 1000));
      
    }
        set({ 
          user: data, 
          isAuthenticated: true, 
          loading: false 
        });
      } catch (error) {
        console.error('Fetch user error:', error.response?.status);
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false,
          error: 'Помилка завантаження профілю'
        });
        localStorage.removeItem('authToken');
      }
    },

    updateProfile: async (profileData) => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiClient.put('/me', profileData);
        set((state) => ({
          user: { ...state.user, ...data },
          loading: false
        }));
        return data;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Помилка оновлення',
          loading: false 
        });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false, 
        error: null 
      });
    },

    checkAuth: async () => {
      const token = localStorage.getItem('authToken');
      if (token && !get().isAuthenticated) {
        await get().fetchCurrentUser();
      }
    }
  }))
);

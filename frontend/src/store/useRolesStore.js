import { create } from 'zustand';
import apiClient from '../api/client';

export const useRolesStore = create((set, get) => ({
  roles: [],
  isLoading: false,

  fetchRoles: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/roles');
      set({ roles: data || [] });
    } catch (error) {
      console.error('Помилка завантаження ролей:', error);
      set({ roles: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addRole: async (roleData) => {
    try {
      const { data } = await apiClient.post('/roles', roleData);
      set((state) => ({ roles: [...state.roles, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання ролі:', error);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const { data } = await apiClient.put('/roles', roleData);
      set((state) => ({
        roles: state.roles.map(role => 
          role.id === id ? data : role
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення ролі:', error);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      await apiClient.delete(`/roles/${id}`);
      set((state) => ({
        roles: state.roles.filter(role => role.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення ролі:', error);
      throw error;
    }
  }
}));

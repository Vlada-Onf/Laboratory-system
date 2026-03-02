import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import apiClient from '../api/client';

export const useAdminUsersStore = create(
  devtools((set, get) => ({
    adminUsers: [],
    loading: false,
    error: null,

    fetchAdminUsers: async () => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiClient.get('/users');
        set({ adminUsers: data, loading: false });
        return data;
      } catch (error) {
        console.log('ADMIN USERS ERROR:', error.response?.status);
        set({ error: `AdminUsers: ${error.response?.status}`, loading: false });
      }
    },

    fetchUserById: async (id) => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiClient.get(`/users/${id}`);
        console.log('USER LOADED:', data);
        return data;
      } catch (error) {
        console.error('USER ERROR:', error.response?.status);
        set({ error: `User ${id}: ${error.response?.status}` });
        throw error;
      }
    },

updateUser: async (userData) => {
  const state = get();
  set({ loading: true, error: null });

  try {
    const currentUser = state.adminUsers.find(u => u.id === userData.id);
    const requestBody = {
      firstName: currentUser?.firstName || "Користувач",
      lastName: currentUser?.lastName || "Користувач",
      roleId: userData.roleId,
      isActive: currentUser?.isActive ?? true
    };

    const { data } = await apiClient.put(`/users/${userData.id}`, requestBody);

    console.log('BACKEND RESPONSE:', {
      roleId: data.roleId,
      roleName: data.roleName,
      requestRoleId: userData.roleId
    });

    set((state) => ({
      adminUsers: state.adminUsers.map(user =>
        user.id === userData.id
          ? { ...user, roleId: data.roleId, roleName: data.roleName }
          : user
      )
    }));

    await get().fetchAdminUsers();
    return data;
  } catch (error) {
    console.error('NETWORK ERROR:', error);
    throw error;
  } finally {
    set({ loading: false });
  }
},

    toggleUserActive: async (id, isActive) => {
      set({ loading: true, error: null });
      try {
        const endpoint = isActive ? 'unblock' : 'block';
        console.log(`${endpoint.toUpperCase()} USER:`, id);
        await apiClient.post(`/admin/users/${id}/${endpoint}`);

        set((state) => ({
          adminUsers: state.adminUsers.map(user =>
            user.id === id ? { ...user, isActive } : user
          ),
          loading: false
        }));
        console.log('USER STATUS CHANGED!');
      } catch (error) {
        console.error('TOGGLE ERROR:', error.response?.data);
        set({ error: error.response?.data?.message || 'Помилка статусу', loading: false });
        throw error;
      }
    },

toggleUserStatus: async (userId, isActive) => {
  set({ loading: true, error: null });
  try {
    console.log(`PATCH /users/${userId}/status → ${isActive ? 'ACTIVE' : 'BLOCKED'}`);

    const { data } = await apiClient.patch(`/users/${userId}/status`, {
      isActive
    });

    set((state) => ({
      adminUsers: state.adminUsers.map(user =>
        user.id === userId
          ? { ...user, isActive: data.isActive }
          : user
      ),
      loading: false
    }));

    return data;
  } catch (error) {
    console.error('STATUS ERROR:', error.response?.data);
    set({
      error: error.response?.data?.message || 'Помилка блокування',
      loading: false
    });
    throw error;
  }
},
    deleteUser: async (id) => {
      set({ loading: true, error: null });
      try {
        console.log('DELETING USER:', id);
        await apiClient.delete(`/users/${id}`);

        set((state) => ({
          adminUsers: state.adminUsers.filter(user => user.id !== id),
          loading: false
        }));
        console.log('USER DELETED!');
      } catch (error) {
        console.error('DELETE ERROR:', error.response?.data);
        set({ error: error.response?.data?.message || 'Помилка видалення', loading: false });
        throw error;
      }
    },

    clearError: () => set({ error: null }),

    refreshUsers: async () => {
      await get().fetchAdminUsers();
    }
  }),
  { name: 'useAdminUsersStore' }
));

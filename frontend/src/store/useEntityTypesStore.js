import { create } from 'zustand';
import apiClient from '../api/client';

export const useEntityTypesStore = create((set, get) => ({
  entityTypes: [],
  isLoading: false,

  fetchEntityTypes: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/entity-types');
      set({ entityTypes: data || [] });
    } catch (error) {
      console.error('Помилка завантаження сутностей:', error);
      set({ entityTypes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addEntityType: async (entityData) => {
    try {
      const { data } = await apiClient.post('/entity-types', entityData);
      set((state) => ({ entityTypes: [...state.entityTypes, data] }));
      return data;
    } catch (error) {
      console.error('Помилка додавання сутності:', error);
      throw error;
    }
  },

  updateEntityType: async (id, entityData) => {
    try {
      const { data } = await apiClient.put('/entity-types', entityData);
      set((state) => ({
        entityTypes: state.entityTypes.map(entity => 
          entity.id === id ? data : entity
        )
      }));
      return data;
    } catch (error) {
      console.error('Помилка оновлення сутності:', error);
      throw error;
    }
  },

  deleteEntityType: async (id) => {
    try {
      await apiClient.delete(`/entity-types/${id}`);
      set((state) => ({
        entityTypes: state.entityTypes.filter(entity => entity.id !== id)
      }));
    } catch (error) {
      console.error('Помилка видалення сутності:', error);
      throw error;
    }
  }
}));

import { create } from 'zustand';
import apiClient from '../api/client';

export const useTagsStore = create((set, get) => ({
  tags: [],
  componentTags: {},
  isLoading: false,

  fetchTags: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/tags');
      set({ tags: data || [] });
    } catch (error) {
      console.error('fetchTags FAILED:', error.response?.status, error.response?.data);
      set({ tags: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTagsByComponent: async (componentId) => {
    try {
      const { data } = await apiClient.get(`/tags/by-component/${componentId}`);
      
      set((state) => ({
        componentTags: {
          ...state.componentTags,
          [componentId]: data || []
        }
      }));
      
      return data || [];
    } catch (error) {
      console.error('fetchTagsByComponent ERROR:', {
        componentId,
        status: error.response?.status,
        data: error.response?.data
      });
      
      set((state) => ({
        componentTags: {
          ...state.componentTags,
          [componentId]: []
        }
      }));
      return [];
    }
  },

  clearComponentTags: (componentId) => {
    set((state) => ({
      componentTags: {
        ...state.componentTags,
        [componentId]: undefined
      }
    }));
  },

  createTag: async (tagName) => {
    if (!tagName?.trim()) {
      throw new Error('Назва тегу не може бути порожньою');
    }

    const cleanName = tagName.trim().toLowerCase();

    try {
      let existingLocal = get().tags.find(t => t.name.toLowerCase() === cleanName);
      if (existingLocal) {
        return existingLocal;
      }

      if (get().tags.length === 0) {
        await get().fetchTags();
      }

      const existingAfterFetch = get().tags.find(t => t.name.toLowerCase() === cleanName);
      if (existingAfterFetch) {
        return existingAfterFetch;
      }

      const { data } = await apiClient.post('/tags', {
        name: tagName.trim(),
        color: "#888888",
        createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      });

      set(state => ({
        tags: [...state.tags, data]
      }));

      return data;
    } catch (error) {
      console.error('createTag FAILED:', {
        name: tagName,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  getComponentTags: (componentId) => {
    const state = get();

    const cached = state.componentTags[componentId];
    if (cached !== undefined) {
      return Promise.resolve(cached);
    }
    return get().fetchTagsByComponent(componentId);
  },

  deleteTag: async (tagId) => {
    try {
      await apiClient.delete(`/tags/${tagId}`);
      
      set((state) => ({
        tags: state.tags.filter(tag => tag.id !== tagId)
      }));
      
      set((state) => ({
        componentTags: Object.fromEntries(
          Object.entries(state.componentTags).filter(([, tags]) => 
            !tags?.some(t => t.id === tagId)
          )
        )
      }));
      
    } catch (error) {
      console.error('deleteTag FAILED:', error.response?.status);
      throw error;
    }
  },

  clearAllCache: () => {
    set({
      componentTags: {},
      tags: []
    });
  }
}));

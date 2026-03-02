import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useTagsStore = create((set, get) => ({
  tags: [],
  componentTags: {},
  isLoading: false,

  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

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

    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Потрібен авторизований користувач');
    }

    const { data } = await apiClient.post('/tags', {
      name: tagName.trim(),
      color: "#888888",
      createdBy: userId,
      performedBy: userId
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

  updateTag: async (tagId, tagData) => {
    try {
      const userId = get().getCurrentUserId();
      if (!userId) throw new Error('Потрібен авторизований користувач');

      const dataWithUser = {
        id: tagId,
        ...tagData,
        performedBy: userId
      };

      const { data } = await apiClient.put(`/tags/${tagId}`, dataWithUser);

      set((state) => ({
        tags: state.tags.map(tag =>
          tag.id === tagId ? data : tag
        )
      }));

      set((state) => ({
        componentTags: Object.fromEntries(
          Object.entries(state.componentTags).map(([compId, tags]) => [
            compId,
            tags?.map(tag => tag.id === tagId ? data : tag) || []
          ])
        )
      }));

      return data;
    } catch (error) {
      console.error('updateTag FAILED:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  deleteTag: async (tagId) => {
    set({ isLoading: true });

    try {
      const userId = get().getCurrentUserId();
      if (!userId) {
        throw new Error('Потрібен авторизований користувач');
      }

      const url = `/tags/${tagId}?performedBy=${userId}`;
      await apiClient.delete(url);
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
      if ([404, 500].includes(error.response?.status)) {
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
        return;
      }

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

removeTagFromComponent: async (componentId, tagId) => {
  set({ isLoading: true });

  try {
    const userId = get().getCurrentUserId();
    if (!userId) {
      throw new Error('Потрібен авторизований користувач');
    }

    const url = `/components/${componentId}/tags/${tagId}?performedBy=${userId}`;
    await apiClient.delete(url);
    set((state) => ({
      componentTags: {
        ...state.componentTags,
        [componentId]: (state.componentTags[componentId] || []).filter(tag => tag.id !== tagId)
      }
    }));

  } catch (error) {
    console.error('removeTagFromComponent FAILED:', {
      componentId,
      tagId,
      status: error.response?.status,
      data: error.response?.data
    });

    if ([404, 500].includes(error.response?.status)) {
      set((state) => ({
        componentTags: {
          ...state.componentTags,
          [componentId]: (state.componentTags[componentId] || []).filter(tag => tag.id !== tagId)
        }
      }));
      return;
    }

    throw error;
  } finally {
    set({ isLoading: false });
  }
},

  clearAllCache: () => {
    set({
      componentTags: {},
      tags: []
    });
  }
}));

import { create } from 'zustand';
import apiClient from '../api/client';

export const useTagsStore = create((set, get) => ({
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    set({ isLoading: true });
    
    try {
      const { data } = await apiClient.get('/tags');
      set({ tags: data || [] });
    } catch (error) {
      console.error('fetchTags:', error.response?.status);
      set({ tags: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createTag: async (tagName) => {
    
  const cleanName = tagName.trim().toLowerCase();

  try {
    const existingLocal = get().tags.find(
      t => t.name.toLowerCase() === cleanName
    );

    if (existingLocal) return existingLocal;

    if (get().tags.length === 0) {
      await get().fetchTags();
    }

    const existingAfterFetch = get().tags.find(
      t => t.name.toLowerCase() === cleanName
    );

    if (existingAfterFetch){
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
    console.error('createTag:', error.response?.status);
    throw error;
  }
},
  deleteTag: async (tagId) => {
    try {
      await apiClient.delete(`/tags/${tagId}`);
      set((state) => ({
        tags: state.tags.filter(tag => tag.id !== tagId)
      }));
    } catch (error) {
      console.error('deleteTag:', error);
      throw error;
    }
  }
}));

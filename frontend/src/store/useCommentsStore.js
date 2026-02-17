import { create } from 'zustand';
import apiClient from '../api/client';

export const useCommentsStore = create((set, get) => ({
  commentsByComponent: {},
  isLoading: false,

  fetchCommentsByComponent: async (componentId) => {
    set({ isLoading: true });

    try {
      const { data } = await apiClient.get(`/component-comments/by-component/${componentId}`);

      set((state) => ({
        commentsByComponent: {
          ...state.commentsByComponent,
          [componentId]: data || []
        }
      }));

    } catch (error) {
      console.error('[COMMENTS] API ERROR:', error);
      set((state) => ({
        commentsByComponent: {
          ...state.commentsByComponent,
          [componentId]: []
        }
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  addComment: async (componentId, content) => {

    const commentData = {
      componentId,
      content: content.trim(),
      createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };

    try {
      const { data } = await apiClient.post('/component-comments', commentData);

      set((state) => {
        const currentComments = state.commentsByComponent[componentId] || [];
        return {
          commentsByComponent: {
            ...state.commentsByComponent,
            [componentId]: [data, ...currentComments]
          }
        };
      });

    } catch (error) {
      console.error('[COMMENTS] ADD ERROR:', error);
    }
  },

  updateComment: async (componentId, commentId, content) => {

    const updateData = {
      id: commentId,
      content: content.trim()
    };

    try {
      const { data } = await apiClient.put('/component-comments', updateData);
      await get().fetchComponents();
      set((state) => {
        const comments = state.commentsByComponent[componentId] || [];
        const updatedComments = comments.map(c => 
          c.id === commentId ? data : c
        );
        
        return {
          commentsByComponent: {
            ...state.commentsByComponent,
            [componentId]: updatedComments
          }
        };
      });

    } catch (error) {
      console.error('[COMMENTS] UPDATE ERROR:', error);
    }
  },

  deleteComment: async (componentId, commentId) => {

    try {
      await apiClient.delete(`/component-comments/${commentId}`);

      set((state) => ({
        commentsByComponent: {
          ...state.commentsByComponent,
          [componentId]: state.commentsByComponent[componentId]?.filter(c => c.id !== commentId) || []
        }
      }));

    } catch (error) {
      console.error('[COMMENTS] DELETE ERROR:', error);
    }
  },

  clearComments: (componentId) => {
    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: []
      }
    }));
  }
}));


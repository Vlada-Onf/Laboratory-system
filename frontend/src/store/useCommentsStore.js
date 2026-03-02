import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useCommentsStore = create((set, get) => ({
  commentsByComponent: {},
  isLoading: false,
  userCache: {},
  profile: null,

  syncProfile: (profileData) => set({ profile: profileData }),

  refreshCurrentUserData: (updatedUserData) => {
    const state = get();
    const userId = updatedUserData.id;

    set({
      userCache: {
        ...state.userCache,
        [userId]: {
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName || '',
          email: updatedUserData.email || '',
          photoUrl: updatedUserData.photoUrl || null
        }
      }
    });

    const updatedCommentsByComponent = {};
    let updatedCount = 0;
    Object.entries(state.commentsByComponent).forEach(([compId, comments]) => {
      const refreshedComments = comments.map(comment => {
        if (comment.createdBy === userId) {
          updatedCount++;
          return {
            ...comment,
            createdByFirstName: updatedUserData.firstName,
            createdByLastName: updatedUserData.lastName || '',
            createdByEmail: updatedUserData.email || '',
            createdByPhotoUrl: updatedUserData.photoUrl || null
          };
        }
        return comment;
      });
      updatedCommentsByComponent[compId] = refreshedComments;
    });

    set({ commentsByComponent: updatedCommentsByComponent });
    console.log(`Updated ${updatedCount} comments for ${updatedUserData.firstName}`);
  },

  fetchCommentsByComponent: async (componentId) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get(`/component-comments/by-component/${componentId}`);

      const enrichedComments = data.map(comment => ({
        ...comment,
        createdByFirstName: comment.authorFirstName || 'Невідомий',
        createdByLastName: comment.authorLastName || '',
        createdByEmail: comment.authorEmail || '',
        createdByPhotoUrl: comment.authorPhotoUrl || null,
        isCurrentUser: comment.createdBy === useProfileStore.getState().profile?.id,
        displayName: `${comment.authorFirstName || ''} ${comment.authorLastName || ''}`.trim() || 'Невідомий',
        timeAgo: comment.createdAt ? new Date(comment.createdAt).toLocaleString('uk-UA') : '',
        timeFormatted: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('uk-UA') + ' ' + new Date(comment.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : ''
      }));

      const userCacheUpdate = {};
      enrichedComments.forEach(comment => {
        if (comment.createdBy && !get().userCache[comment.createdBy]) {
          userCacheUpdate[comment.createdBy] = {
            firstName: comment.authorFirstName,
            lastName: comment.authorLastName,
            email: comment.authorEmail,
            photoUrl: comment.authorPhotoUrl
          };
        }
      });

      set((state) => ({
        commentsByComponent: {
          ...state.commentsByComponent,
          [componentId]: enrichedComments
        },
        userCache: {
          ...state.userCache,
          ...userCacheUpdate
        }
      }));

    } catch (error) {
      console.error('fetchCommentsByComponent ERROR:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        componentId
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addComment: async (componentId, content) => {
  const profileStore = useProfileStore.getState();
  const currentUserId = profileStore.profile?.id;
  
  if (!currentUserId) {
    console.error('Авторизуйтесь для додавання коментаря!');
    return;
  }

  try {
    console.log('componentId:', componentId);
    console.log('currentUserId:', currentUserId);
    console.log('content:', content.trim());

    const payload = {
      componentId,
      content: content.trim(),
      createdBy: currentUserId,
      performedBy: currentUserId
    };
    const response = await apiClient.post('/component-comments', payload);
    console.log('RESPONSE:', response.data);

    await get().fetchCommentsByComponent(componentId);
    console.log('[COMMENTS] Comment CREATED & REFETCHED');

  } catch (error) {
    console.error('[COMMENTS] ADD ERROR FULL RESPONSE:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    console.error('Full error:', error);
    throw error;
  }
},

  updateComment: async (componentId, commentId, content) => {
    const profileStore = useProfileStore.getState();
    const currentUserId = profileStore.profile?.id;

    if (!currentUserId) {
      throw new Error(' Авторизуйтесь для редагування!');
    }

    try {
      console.log('[COMMENTS] Updating comment:', commentId);

      await apiClient.put('/component-comments', {
        id: commentId,
        content: content.trim(),
        performedBy: currentUserId
      });

      await get().fetchCommentsByComponent(componentId);
      console.log('[COMMENTS] Comment UPDATED & REFETCHED');

    } catch (error) {
      console.error('[COMMENTS] UPDATE ERROR:', error);
      throw error;
    }
  },

  deleteComment: async (componentId, commentId) => {
    const profileStore = useProfileStore.getState();
    const currentUserId = profileStore.profile?.id;

    if (!currentUserId) {
      throw new Error('[COMMENTS] Авторизуйтесь для видалення!');
    }

    try {
      await apiClient.delete(`/component-comments/${commentId}?performedBy=${currentUserId}`);
      await get().fetchCommentsByComponent(componentId);
      console.log('[COMMENTS] Comment DELETED & REFETCHED');
    } catch (error) {
      if (error.response?.status === 500) {
        console.log('500 = Backend logging fail, comment deleted');
      } else {
        console.error('[COMMENTS] DELETE ERROR:', error);
        throw error;
      }
    }
  },

  clearComments: (componentId) => {
    set((state) => ({
      commentsByComponent: {
        ...state.commentsByComponent,
        [componentId]: []
      }
    }));
  },

  getCommentsForComponent: (componentId) => get().commentsByComponent[componentId] || [],
  getCommentCount: (componentId) => get().commentsByComponent[componentId]?.length || 0,
  isEmpty: (componentId) => get().getCommentCount(componentId) === 0
}));

import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useSchematicLinksStore = create((set, get) => ({
  linksBySchematic: {},
  isLoading: {},

  getLinksForSchematic: (schematicId) => {
    return get().linksBySchematic[schematicId] || [];
  },

  isLoadingForSchematic: (schematicId) => {
    return get().isLoading[schematicId] || false;
  },

  getCurrentUserId: () => {
    const profile = useProfileStore.getState().profile;
    return profile?.id || null;
  },

  fetchSchematicLinks: async (schematicId) => {
    set((state) => ({
      isLoading: { ...state.isLoading, [schematicId]: true }
    }));

    try {
      const { data } = await apiClient.get(`/schematic-links/by-schematic/${schematicId}`);
      set((state) => ({
        linksBySchematic: {
          ...state.linksBySchematic,
          [schematicId]: data || []
        },
        isLoading: {
          ...state.isLoading,
          [schematicId]: false
        }
      }));

    } catch (error) {
      console.error('ПОМИЛКА ЗАВАНТАЖЕННЯ ПОСИЛАНЬ:', error);

      set((state) => ({
        linksBySchematic: {
          ...state.linksBySchematic,
          [schematicId]: []
        },
        isLoading: {
          ...state.isLoading,
          [schematicId]: false
        }
      }));
    }
  },

  addSchematicLink: async (linkData) => {
    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Авторизуйтесь для додавання посилань!');
    }

    if (!linkData.schematicId) {
      throw new Error('schematicId обов\'язковий!');
    }

    const dataToSend = {
      SchematicId: linkData.schematicId,
      Url: linkData.url?.trim() || '',
      Title: linkData.title?.trim() || 'Посилання',
      Description: linkData.description?.trim() || '',
      CreatedBy: userId,
      PerformedBy: userId
    };

    try {
      const { data } = await apiClient.post('/schematic-links', dataToSend);
      set((state) => {
        const currentLinks = state.linksBySchematic[linkData.schematicId] || [];
        return {
          linksBySchematic: {
            ...state.linksBySchematic,
            [linkData.schematicId]: [data, ...currentLinks]
          }
        };
      });
      return data;
    } catch (error) {
      console.error('ПОМИЛКА ДОДАВАННЯ:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  updateSchematicLink: async (linkId, linkData) => {
    const userId = get().getCurrentUserId();
    if (!userId) throw new Error('Авторизуйтесь для редагування посилань!');

    const dataToSend = {
      Id: linkId,
      Title: linkData.title?.trim() || 'Посилання',
      Url: linkData.url?.trim() || '',
      Description: linkData.description?.trim() || '',
      UpdatedBy: userId,
      PerformedBy: userId
    };

    try {
      const { data } = await apiClient.put(`/schematic-links/${linkId}`, dataToSend);

      set((state) => {
        const updatedLinksBySchematic = {};
        Object.entries(state.linksBySchematic).forEach(([schematicId, links]) => {
          updatedLinksBySchematic[schematicId] = links.map(link => 
            link.id === linkId ? data : link
          );
        });
        return { linksBySchematic: updatedLinksBySchematic };
      });
      return data;
    } catch (error) {
      console.error('ПОМИЛКА РЕДАГУВАННЯ:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  deleteSchematicLink: async (linkId) => {
    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Авторизуйтесь для видалення!');
    }

    try {
      const url = `/schematic-links/${linkId}?performedBy=${userId}`;
      console.log('DELETE URL:', url);
      await apiClient.delete(url);

      set((state) => {
        const updatedLinksBySchematic = {};
        Object.entries(state.linksBySchematic).forEach(([schematicId, links]) => {
          updatedLinksBySchematic[schematicId] = links.filter(link => link.id !== linkId);
        });
        return { linksBySchematic: updatedLinksBySchematic };
      });
    } catch (error) {
      console.error('ПОМИЛКА ВИДАЛЕННЯ:', {
        status: error.response?.status,
        data: error.response?.data
      });
      if ([404, 500].includes(error.response?.status)) {
        set((state) => {
          const updatedLinksBySchematic = {};
          Object.entries(state.linksBySchematic).forEach(([schematicId, links]) => {
            updatedLinksBySchematic[schematicId] = links.filter(link => link.id !== linkId);
          });
          return { linksBySchematic: updatedLinksBySchematic };
        });
        console.log('Backend error, локально видалено');
        return;
      }
      throw error;
    }
  },

  clearSchematicLinks: (schematicId) => {
    set((state) => ({
      linksBySchematic: {
        ...state.linksBySchematic,
        [schematicId]: []
      },
      isLoading: {
        ...state.isLoading,
        [schematicId]: false
      }
    }));
  },

  clearAllLinks: () => {
    set({
      linksBySchematic: {},
      isLoading: {}
    });
  }
}));

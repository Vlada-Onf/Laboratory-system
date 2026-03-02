import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';
import { useSchematicLinksStore } from './useSchematicLinksStore';
import { useComponentsStore } from './useComponentsStore';

export const useSchematicsStore = create((set, get) => ({
  schematics: [],
  isLoading: false,
  editModal: { open: false, schematic: null },

  waitForUserId: async () => {
    let userId = useProfileStore.getState().profile?.id;
    let attempts = 0;
    while (!userId && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      userId = useProfileStore.getState().profile?.id;
      attempts++;
    }
    return userId;
  },

  getCurrentUserId: () => useProfileStore.getState().profile?.id || null,

  fetchSchematicsByComponent: async (componentId) => {
    set({ isLoading: true });
    try {
      await useSchematicLinksStore.getState().fetchSchematicLinks(componentId);

      const { data } = await apiClient.get(`/schematics/by-component/${componentId}`);
      set({ schematics: data || [] });
      console.log('СХЕМИ ЗАВАНТАЖЕНО:', data?.length || 0);
    } catch (error) {
      console.error('ПОМИЛКА ЗАВАНТАЖЕННЯ СХЕМ:', error);
      set({ schematics: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllSchematicsForSearch: async () => {
    set({ isLoading: true });
    try {
      const components = useComponentsStore.getState().components || [];
      const results = await Promise.all(
        components.slice(0, 10).map(comp =>
          apiClient
            .get(`/schematics/by-component/${comp.id}`)
            .then(res => res.data || [])
            .catch(() => [])
        )
      );
      set({ schematics: results.flat().slice(0, 100) });
    } catch (error) {
      set({ schematics: [], error });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleSchematic: async (schematicId) => {
    try {
      const { data } = await apiClient.get(`/schematics/${schematicId}`);
      await useSchematicLinksStore.getState().fetchSchematicLinks(data.componentId);
      return data;
    } catch (error) {
      console.error('fetchSingleSchematic FAILED:', error);
      throw error;
    }
  },

  addSchematic: async (formData, imageFile, documentFile = null) => {
    set({ isLoading: true });
    try {
      const userId = await get().waitForUserId();
      if (!userId){
        throw new Error('Авторизуйтесь для створення схеми!');
      }

      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('Фото схеми обов\'язкове!');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('ComponentId', formData.componentId);
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('CreatedBy', userId);
      formDataToSend.append('PerformedBy', userId);
      if (formData.description){
        formDataToSend.append('Description', formData.description);
      }
      if (formData.usefulLinkId){
        formDataToSend.append('UsefulLinkId', formData.usefulLinkId);
      }
      formDataToSend.append('image', imageFile);
      if (documentFile instanceof File){
        formDataToSend.append('document', documentFile);
      }

      const { data } = await apiClient.post('/schematics', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      await get().fetchSchematicsByComponent(formData.componentId);
      return data;
    } catch (error) {
      console.error('addSchematic FAILED:', error.response?.data || error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSchematic: async (schematicId, formData, imageFile = null, documentFile = null) => {
    set({ isLoading: true });
    try {
      const userId = await get().waitForUserId();
      if (!userId){
        throw new Error('Авторизуйтесь для редагування!');
      }

      const currentSchematic = get().schematics.find(s => s.id === schematicId);
      const formDataToSend = new FormData();
      formDataToSend.append('Id', schematicId);
      formDataToSend.append('ComponentId', formData.componentId || currentSchematic?.componentId);
      formDataToSend.append('Title', formData.title || '');
      formDataToSend.append('UpdatedBy', userId);
      formDataToSend.append('PerformedBy', userId);

      if (formData.description){
        formDataToSend.append('Description', formData.description);
      }
      if (formData.usefulLinkId){
        formDataToSend.append('UsefulLinkId', formData.usefulLinkId);
      }
      if (imageFile instanceof File){
        formDataToSend.append('image', imageFile);
      }
      if (documentFile instanceof File){
        formDataToSend.append('document', documentFile);
      }

      const { data } = await apiClient.put('/schematics', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      set((state) => ({
        schematics: state.schematics.map(s => s.id === schematicId ? data : s)
      }));

      await get().fetchSchematicsByComponent(formData.componentId || currentSchematic?.componentId);
      return data;
    } catch (error) {
      console.error('updateSchematic FAILED:', error.response?.data || error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSchematic: async (schematicId) => {
    set({ isLoading: true });
    try {
      const userId = await get().waitForUserId();
      if (!userId){
        throw new Error('Авторизуйтесь для видалення!');
      }

      const url = `/schematics/${schematicId}?performedBy=${userId}`;
      await apiClient.delete(url);

      set((state) => ({
        schematics: state.schematics.filter(s => s.id !== schematicId)
      }));
    } catch (error) {
      console.error('deleteSchematic FAILED:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      const deletedSchematic = get().schematics.find(s => s.id === schematicId);
      const componentId = deletedSchematic?.componentId;
      if (componentId) await get().fetchSchematicsByComponent(componentId);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  openEditModal: (schematic) => set({ editModal: { open: true, schematic } }),
  closeEditModal: () => set({ editModal: { open: false, schematic: null } }),
}));
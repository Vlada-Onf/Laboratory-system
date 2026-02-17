import { create } from 'zustand';
import apiClient from '../api/client';
import { useNeedsStore } from './useNeedsStore';

export const useComponentsStore = create((set, get) => ({
  components: [],
  isLoading: false,
  currentComponent: null,

  normalizeComponent: (comp) => ({
    ...comp,
    tags: comp.tags?.map(tag => 
      typeof tag === 'object' ? tag.name : tag
    ) || []
  }),

  fetchComponents: async () => {
    set({ isLoading: true });

    try {
      const startTime = Date.now();
      const { data, status} = await apiClient.get('/components');
      const endTime = Date.now();
      
      console.log('fetchComponents SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status,
        count: data?.length || 0,
        firstItem: data?.[0] || 'empty',
      });
      
      const normalizedComponents = (data || []).map(comp => 
        get().normalizeComponent(comp)
      );
      
      set({ components: normalizedComponents });
    } catch (error) {
      console.error('fetchComponents FAILED:', error.response?.status, error.message);
      set({ components: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addComponent: async (newComponent) => {
    try {
      const dataToSend = {
        tagIds: newComponent.tagIds || [],
        ...newComponent,
        createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        photoUrl: "віапб",
        categoryId: newComponent.categoryId || null,
        quantity: parseInt(newComponent.quantity) || 0,
        price: parseFloat(newComponent.price) || 0,
      };

      const startTime = Date.now();
      const response = await apiClient.post('/components', dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      const endTime = Date.now();

      const normalizedData = get().normalizeComponent(response.data);

      console.log('addComponent SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status: response.status,
        tags: normalizedData.tags,
        data: normalizedData
      });

      set((state) => ({
        components: [...state.components, normalizedData]
      }));

      return normalizedData;
    } catch (error) {
      console.error('addComponent FAILED:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  updateComponent: async (componentId, updatedComponent) => {
    try {
      const dataToSend = {
        id: componentId,
        categoryId: updatedComponent.categoryId || null,
        name: updatedComponent.name || "string",
        description: updatedComponent.description || "string",
        quantity: parseInt(updatedComponent.quantity) || 0,
        price: parseFloat(updatedComponent.price) || 0,
        photoUrl: updatedComponent.photoUrl || "string",
        supplierLink: updatedComponent.supplierLink || "string",
        documentationLink: updatedComponent.documentationLink || "string",
        tagIds: updatedComponent.tagIds || [],
        lastUpdatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      };

      const { data } = await apiClient.put('/components', dataToSend);
      
      const normalizedData = get().normalizeComponent(data);

      set((state) => ({
        components: state.components.map(comp => 
          comp.id === componentId ? normalizedData : comp
        )
      }));

      const updateComponentInNeeds = useNeedsStore.getState().updateComponentInNeeds;
      if (typeof updateComponentInNeeds === 'function') {
        updateComponentInNeeds({
          ...normalizedData,
          image: normalizedData.photoUrl
        });
      }

      return normalizedData;
    } catch (error) {
      console.error('updateComponent FAILED:', error);
      throw error;
    }
  },

  deleteComponent: async (id) => {
    try {
      const startTime = Date.now();
      const { status } = await apiClient.delete(`/components/${id}`);
      const endTime = Date.now();
      
      console.log('deleteComponent SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status,
      });

      set((state) => ({
        components: state.components.filter((comp) => comp.id !== id),
      }));

      useNeedsStore.getState().updateComponentInNeeds(id, null);
    } catch (error) {
      console.error('deleteComponent FAILED:', error);
      throw error;
    }
  },

  setCurrentComponent: (component) => {
    set({ currentComponent: component });
  },

  clearCurrentComponent: () => {
    set({ currentComponent: null });
  },

  setComponents: (components) => {
    const normalized = components.map(comp => get().normalizeComponent(comp));
    set({ components: normalized });
  },

  editModal: { open: false, component: null },
  openEditModal: (component) => {
    set({ editModal: { open: true, component } });
  },
  closeEditModal: () => {
    set({ editModal: { open: false, component: null } });
  },
}));

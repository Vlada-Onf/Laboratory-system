import { create } from 'zustand';
import apiClient from '../api/client';
import { useNeedsStore } from './useNeedsStore';

export const useComponentsStore = create((set) => ({
  components: [],
  isLoading: false,
  currentComponent: null,

  fetchComponents: async () => {
    set({ isLoading: true });

    try {
      const startTime = Date.now();
      const { data, status, headers } = await apiClient.get('/components');
      const endTime = Date.now();
      
      console.log('fetchComponents SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status,
        count: data?.length || 0,
        firstItem: data?.[0] || 'empty',
        headers: Object.fromEntries(Object.entries(headers).slice(0, 10))
      });
      
      set({ components: data || [] });
    } catch (error) {
      console.error('fetchComponents FAILED:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        stack: error.stack,
      });
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
        supplierLink: "https://example.com/supplier", 
        documentationLink: "https://example.com/docs",
       
        categoryId: newComponent.categoryId || null,
        quantity: parseInt(newComponent.quantity) || 0,
        price: parseFloat(newComponent.price) || 0,
      };

      console.log('typeof dataToSend:', {
        categoryId: typeof dataToSend.categoryId,
        name: typeof dataToSend.name,
        quantity: typeof dataToSend.quantity,
        price: typeof dataToSend.price,
        tagIds: Array.isArray(dataToSend.tagIds),
      });
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          ...apiClient.defaults.headers.common
        }
      };

      const startTime = Date.now();
      
      const response = await apiClient.post('/components', dataToSend, config);
      const endTime = Date.now();

      console.log('addComponent SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status: response.status,
        data: response.data,
        headers: Object.fromEntries(Object.entries(response.headers).slice(0, 10))
      });

      set((state) => {
        const newState = { components: [...state.components, response.data] };
        return newState;
      });

      return response.data;
    } catch (error) {
      console.error('addComponent FAILED - FULL ERROR:', {
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data ? JSON.stringify(JSON.parse(error.config.data), null, 2) : error.config?.data,
          headers: error.config?.headers,
        },
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        },
        message: error.message,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      });
      
      if (error.response?.status === 500) {
        console.error('SERVER 500 ERROR - check backend logs');
      }
      
      throw error;
    }
  },
updateComponent: async (componentId, updatedComponent) => {
  try {
    const dataToSend = {
      id: componentId,
      categoryId: updatedComponent.categoryId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: updatedComponent.name || "string",
      description: updatedComponent.description || "string",
      quantity: parseInt(updatedComponent.quantity) || 0,
      price: parseFloat(updatedComponent.price) || 0,
      photoUrl: updatedComponent.photoUrl || "string",
      supplierLink: updatedComponent.supplierLink || "string",
      documentationLink: updatedComponent.documentationLink || "string",
      lastUpdatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    };

    const { data } = await apiClient.put('/components', dataToSend);
    
    set((state) => ({
      components: state.components.map(comp => 
        comp.id === componentId ? data : comp
      )
    }));

    useNeedsStore.getState().updateComponentInNeeds(componentId, {
      name: data.name,
      image: data.photoUrl,
      categoryId: data.categoryId,
    });

    return data;
  } catch (error) {
    console.error('updateComponent FAILED:', error);
    throw error;
  }
},
  deleteComponent: async (id) => {

    try {
      const startTime = Date.now();
      const { status, data} = await apiClient.delete(`/components/${id}`);
      const endTime = Date.now();
      
      console.log('deleteComponent SUCCESS:', {
        duration: `${endTime - startTime}ms`,
        status,
        data,
      });

      set((state) => ({
        components: state.components.filter((comp) => comp.id !== id),
      }));

      useNeedsStore.getState().updateComponentInNeeds(id, null);
    } catch (error) {
      console.error('deleteComponent FAILED:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
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
    set({ components });
  },

  editModal: { open: false, component: null },
  openEditModal: (component) => {
    set({ editModal: { open: true, component } });
  },
  closeEditModal: () => {
    set({ editModal: { open: false, component: null } });
  },
}));

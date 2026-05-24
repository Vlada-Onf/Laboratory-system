import { create } from 'zustand';
import apiClient from '@/api/client';
import { useProfileStore } from './useProfileStore';

export const useComponentsStore = create((set, get) => ({
  components: [],
  isLoading: false,
  currentComponent: null,
  editModal: { open: false, component: null },
  statForecast: [],
  aiForecast: [],

  addComponent: async (formData, file) => {
    console.log('addComponent ОТРИМАВ:', {
      formData: formData.name,
      fileExists: !!file,
      fileType: typeof file,
      fileName: file?.name,
      fileSize: file?.size,
      isFile: file instanceof File
    });

    set({ isLoading: true });

    try {
      if (!file || !(file instanceof File)) {
        throw new Error('Фото обов\'язкове! (File object)');
      }

      const currentUserId = useProfileStore.getState().profile?.id;
      if (!currentUserId){
        throw new Error('Авторизуйтесь для створення компонента!');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('CategoryId', formData.categoryId);
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('CreatedBy', currentUserId);
      if (formData.description){
        formDataToSend.append('Description', formData.description);
      }
      if (formData.quantity){
        formDataToSend.append('Quantity', formData.quantity);
      }
      if (formData.price){
        formDataToSend.append('Price', formData.price);
      }
      if (formData.supplierLink){
        formDataToSend.append('SupplierLink', formData.supplierLink);
      }
      if (formData.documentationLink){
        formDataToSend.append('DocumentationLink', formData.documentationLink);
      }
      formDataToSend.append('image', file);
      formData.tagIds?.forEach(tagId => formDataToSend.append('TagIds', tagId));

      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, typeof value === 'object' ? value.name || 'File' : value);
      }

      const { data } = await apiClient.post('/components', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      set((state) => ({ components: [data, ...state.components] }));
      console.log('Створено:', data);
      return data;

    } catch (error) {
      console.error('FAILED:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateComponent: async (componentId, formData, file = null) => {
    set({ isLoading: true });

    try {
      let currentUserId = useProfileStore.getState().profile?.id;

      let attempts = 0;
      while (!currentUserId && attempts < 50) {
        console.log(`Waiting for profile... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        currentUserId = useProfileStore.getState().profile?.id;
        attempts++;
      }
      if (!currentUserId){
        throw new Error('Авторизуйтесь для редагування!');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('Id', componentId);
      formDataToSend.append('CategoryId', formData.categoryId);
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('LastUpdatedBy', currentUserId);

      if (formData.description){
        formDataToSend.append('Description', formData.description);
      }
      if (formData.quantity){
        formDataToSend.append('Quantity', formData.quantity);
      }
      if (formData.price){
        formDataToSend.append('Price', formData.price);
      }
      if (formData.supplierLink){
        formDataToSend.append('SupplierLink', formData.supplierLink);
      }
      if (formData.documentationLink){
        formDataToSend.append('DocumentationLink', formData.documentationLink);
      }
      if (file && file instanceof File){
        formDataToSend.append('image', file);
      }
      formData.tagIds?.forEach(tagId => formDataToSend.append('TagIds', tagId));

      const { data } = await apiClient.put(`/components`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set((state) => ({
        components: state.components.map(comp => comp.id === componentId ? data : comp),
      }));

      return data;

    } catch (error) {
      console.error('updateComponent FAILED:', error.response?.data || error.message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteComponent: async (componentId) => {
    set({ isLoading: true });

    try {
      const currentUserId = useProfileStore.getState().profile?.id;
      if (!currentUserId){
        throw new Error('Потрібна авторизація');
      }

      const url = `/components/${componentId}?deletedBy=${currentUserId}`;
      console.log('DELETE URL:', url);

      await apiClient.delete(url);

      set((state) => ({
        components: state.components.filter(comp => comp.id !== componentId)
      }));

    } catch (error) {
      console.error('Delete failed:', error);

      if (error.response?.status === 500) {
        console.log('Backend 500 = logging fail, record deleted');
        set((state) => ({
          components: state.components.filter(comp => comp.id !== componentId)
        }));
        return;
      }

      get().fetchComponents();
      throw error;

    } finally {
      set({ isLoading: false });
    }
  },

  fetchComponents: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/components');
      set({ components: data });
      return data;
    } catch (error) {
      console.error('fetchComponents FAILED:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleComponent: async (id) => {
    try {
      const { data } = await apiClient.get(`/components/${id}`);
      set({ currentComponent: data });
      return data;
    } catch (error) {
      console.error('fetchSingleComponent FAILED:', error);
    }
  },

  openEditModal: (component) => set({ editModal: { open: true, component } }),
  closeEditModal: () => set({ editModal: { open: false, component: null } }),
  setCurrentComponent: (component) => set({ currentComponent: component }),

  fetchStatForecast: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/components/forecast');
      set({ statForecast: data });
      return data;
    } catch (error) {
      console.error('fetchStatForecast FAILED:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAiForecast: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/components/forecast/ai');
      set({ aiForecast: data });
      return data;
    } catch (error) {
      console.error('fetchAiForecast FAILED:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  autofillComponentData: async (payload) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/components/autofill', payload);
      console.log('ШІ Автозаповнення успішне:', data);
      return data;
    } catch (error) {
      console.error('autofillComponentData FAILED:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
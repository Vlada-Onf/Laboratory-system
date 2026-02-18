import { create } from 'zustand';
import apiClient from '@/api/client';

export const useComponentsStore = create((set) => ({
  components: [],
  isLoading: false,
  currentComponent: null,
  editModal: { open: false, component: null },

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
      console.error('file не є File object:', file);
      throw new Error('Фото обов\'язкове! (File object)');
    }
    
    const formDataToSend = new FormData();
    
    formDataToSend.append('CategoryId', formData.categoryId);
    formDataToSend.append('Name', formData.name);
    formDataToSend.append('CreatedBy', '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    
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
    
    if (formData.tagIds?.length) {
      formData.tagIds.forEach(tagId => formDataToSend.append('TagIds', tagId));
    }
    
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
    const formDataToSend = new FormData();
    
    formDataToSend.append('Id', componentId); 
    formDataToSend.append('CategoryId', formData.categoryId);
    formDataToSend.append('Name', formData.name);
    formDataToSend.append('LastUpdatedBy', '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    
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
    
    if (file && file instanceof File) {
      formDataToSend.append('image', file);
    }
    
    if (formData.tagIds?.length) {
      formData.tagIds.forEach(tagId => formDataToSend.append('TagIds', tagId));
    }
    
    const { data } = await apiClient.put(`/components`, formDataToSend, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    
    set((state) => ({
      components: state.components.map(comp => 
        comp.id === componentId ? data : comp
      ),
    }));
    
    return data;
    
  } catch (error) {
    console.error('❌ updateComponent FAILED:', error.response?.data || error.message);
    throw error;
  } finally {
    set({ isLoading: false });
  }
},

deleteComponent: async (componentId) => {
  set({ isLoading: true });
  
  try {
    await apiClient.delete(`/components/${componentId}`);
    
    set((state) => ({
      components: state.components.filter(comp => comp.id !== componentId),
    }));
    
    console.log('Компонент видалено:', componentId);
  } catch (error) {
    console.error('deleteComponent FAILED:', error);
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

  openEditModal: (component) => set({ 
    editModal: { open: true, component } 
  }),
  closeEditModal: () => set({ 
    editModal: { open: false, component: null } 
  }),
  setCurrentComponent: (component) => set({ currentComponent: component }),
}));

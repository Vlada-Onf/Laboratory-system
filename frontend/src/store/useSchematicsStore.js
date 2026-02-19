import { create } from 'zustand';
import apiClient from '../api/client';

export const useSchematicsStore = create((set) => ({
  schematics: [],
  isLoading: false,
  editModal: { open: false, schematic: null },

  fetchSchematicsByComponent: async (componentId) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get(`/schematics/by-component/${componentId}`);
      set({ schematics: data || [] });
    } catch {
      set({ schematics: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addSchematic: async (formData, file) => {
  console.log('addSchematic ОТРИМАВ:', {
    formData: formData.title,
    fileExists: !!file,
    fileName: file?.name
  });

  set({ isLoading: true });

  try {
    if (!file || !(file instanceof File)) {
      throw new Error('Фото обов\'язкове! (File object)');
    }
    const formDataToSend = new FormData();
    formDataToSend.append('componentId', formData.componentId);
    formDataToSend.append('Title', formData.title || 'Схема');
    formDataToSend.append('Description', formData.description || '');
    formDataToSend.append('CreatedBy', '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    formDataToSend.append('image', file);

    if (formData.additionalLinks) {
      formDataToSend.append('AdditionalLinks', formData.additionalLinks);
    }
    for (let [key, value] of formDataToSend.entries()) {
  console.log(key, value instanceof File ? value.name : value);
}

    const { data } = await apiClient.post('/schematics', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    set((state) => ({
      schematics: [data, ...state.schematics]
    }));

    console.log('Схема створена:', data);
    return data;

  } catch (error) {
    console.error('addSchematic FAILED:', error.response?.data || error.message);
    throw error;
  } finally {
    set({ isLoading: false });
  }
},


  updateSchematic: async (formData, file = null) => {
  console.log('updateSchematic ОТРИМАВ:', {
    formData: formData.title,
    fileExists: !!file,
    fileName: file?.name,
    schematicId: formData.id
  });

  set({ isLoading: true });

  try {
    const formDataToSend = new FormData();

    formDataToSend.append('Id', formData.id);
    formDataToSend.append('Title', formData.title || 'Схема');
    formDataToSend.append('Description', formData.description || '');
    formDataToSend.append('UpdatedBy', '3fa85f64-5717-4562-b3fc-2c963f66afa6');

    if (formData.additionalLinks) {
      formDataToSend.append('AdditionalLinks', formData.additionalLinks);
    }

    if (file && file instanceof File) {
      formDataToSend.append('image', file);
      console.log('Нове фото додано до FormData');
    } else {
      console.log('Залишаємо старе фото');
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }

    const { data } = await apiClient.put('/schematics', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    set((state) => ({
      schematics: state.schematics.map(s =>
        s.id === formData.id ? data : s
      )
    }));

    console.log('Схема оновлена:', data);
    return data;

  } catch (error) {
    console.error('updateSchematic FAILED:', error.response?.data || error.message);
    throw error;
  } finally {
    set({ isLoading: false });
  }
},

  deleteSchematic: async (schematicId) => {
    await apiClient.delete(`/schematics/${schematicId}`);
    set((state) => ({
      schematics: state.schematics.filter(s => s.id !== schematicId)
    }));
  },

  openEditModal: (schematic) => {
    set({ editModal: { open: true, schematic } });
  },

  closeEditModal: () => {
    set({ editModal: { open: false, schematic: null } });
  },
}));


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

  addSchematic: async (schematicData) => {
    const dataToSend = {
      componentId: schematicData.componentId,
      title: schematicData.title || "Схема",
      description: schematicData.description || "string",
      photoUrl: schematicData.photoUrl || "string",
      additionalLinks: schematicData.links?.join(',') || "string",
      createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"  // хардкор
    };

    const response = await apiClient.post('/schematics', dataToSend);
    set((state) => ({
      schematics: [...state.schematics, response.data]
    }));
    return response.data;
  },

  updateSchematic: async (schematicData) => {
    const dataToSend = {
      id: schematicData.id,
      title: schematicData.title || "Схема",
      description: schematicData.description || "string",
      photoUrl: schematicData.photoUrl || "string",
      additionalLinks: schematicData.links?.join(',') || "string",
      updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"  // хардкор
    };

    const response = await apiClient.put('/schematics', dataToSend);
    set((state) => ({
      schematics: state.schematics.map(s => 
        s.id === schematicData.id ? response.data : s
      )
    }));
    return response.data;
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


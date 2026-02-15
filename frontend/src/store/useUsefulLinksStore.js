import { create } from 'zustand';
import apiClient from '../api/client';

export const useUsefulLinksStore = create((set) => ({
  usefulLinks: [],
  isLoading: false,

  fetchUsefulLinks: async (componentId) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get(`/component-useful-links/by-component/${componentId}`);
      set({ usefulLinks: data || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addUsefulLink: async (linkData) => {
    const dataToSend = {
      componentId: linkData.componentId,
      title: linkData.title || "Посилання",
      url: linkData.url,
      createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };
    
    const response = await apiClient.post('/component-useful-links', dataToSend);
    set((state) => ({
      usefulLinks: [...state.usefulLinks, response.data]
    }));
    
    return response.data;
  },

  updateUsefulLink: async (linkId, linkData) => {
    const dataToSend = {
      id: linkId,
      title: linkData.title || "Посилання",
      url: linkData.url,
      updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };
    
    const response = await apiClient.put('/component-useful-links', dataToSend);
    set((state) => ({
      usefulLinks: state.usefulLinks.map(link => 
        link.id === linkId ? response.data : link
      )
    }));
    
    return response.data;
  },

  deleteUsefulLink: async (linkId) => {
    await apiClient.delete(`/component-useful-links/${linkId}`);
    set((state) => ({
      usefulLinks: state.usefulLinks.filter(link => link.id !== linkId)
    }));
  }
}));

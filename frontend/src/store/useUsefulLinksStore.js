import { create } from 'zustand';
import apiClient from '../api/client';
import { useProfileStore } from './useProfileStore';

export const useUsefulLinksStore = create((set, get) => ({
  usefulLinks: [],
  isLoading: false,

  getCurrentUserId: () => useProfileStore.getState().profile?.id || null,

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
    const userId = get().getCurrentUserId();
    if (!userId){
      throw new Error('Авторизуйтесь для додавання посилань!');
    }

    const dataToSend = {
      componentId: linkData.componentId,
      title: linkData.title || "Посилання",
      url: linkData.url,
      createdBy: userId,
      performedBy: userId
    };

    console.log('POST /component-useful-links:', dataToSend);

    const response = await apiClient.post('/component-useful-links', dataToSend);
    set((state) => ({
      usefulLinks: [...state.usefulLinks, response.data]
    }));

    return response.data;
  },

  updateUsefulLink: async (linkId, linkData) => {
    const userId = get().getCurrentUserId();
    if (!userId) throw new Error('Авторизуйтесь для редагування посилань!');

    const dataToSend = {
      id: linkId,
      title: linkData.title || "Посилання",
      url: linkData.url,
      updatedBy: userId,
      performedBy: userId
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
  const userId = get().getCurrentUserId();
  if (!userId){
    throw new Error('Авторизуйтесь для видалення посилань!');
  }

  try {
    const url = `/component-useful-links/${linkId}?performedBy=${userId}`;
    console.log('DELETE URL:', url);
    await apiClient.delete(url);
  } catch (error) {
    if (error.response?.status === 500) {
      console.log('Backend 500 = deleted, only logging failed');
    } else {
      throw error;
    }
  }

  set((state) => ({
    usefulLinks: state.usefulLinks.filter(link => link.id !== linkId)
  }));
}

}));

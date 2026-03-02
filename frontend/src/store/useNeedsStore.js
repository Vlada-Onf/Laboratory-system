import { create } from 'zustand';
import apiClient from '../api/client';
import { useNeedImportancesStore } from './useNeedImportancesStore';
import { useNeedStatusesStore } from './useNeedStatusesStore';
import { useProfileStore } from './useProfileStore';

export const useNeedsStore = create((set, get) => ({
  needs: [],
  needsRows: [],
  isLoading: false,

  fetchNeeds: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/needs');
      const needsRows = await Promise.all(
        data.map(async (need) => {
          try {
            const { data: component } = await apiClient.get(`/components/${need.componentId}`);
            const importancesStore = useNeedImportancesStore.getState();
            const statusesStore = useNeedStatusesStore.getState();
            const importance = importancesStore.importances.find(i => i.id === need.importanceId);
            const status = statusesStore.statuses.find(s => s.id === need.statusId);

            return {
              id: need.id,
              componentId: need.componentId,
              componentName: component.name,
              componentImage: component.photoUrl,
              categoryId: component.categoryId,
              category: component.category?.name || '—',
              quantity: need.quantityNeeded,
              description: need.description || '—',
              status: status?.name || 'Невідомий',
              statusId: need.statusId,
              priority: importance?.name || 'Низька',
              importanceId: need.importanceId,
              requestedAt: need.requestedAt,
              completedAt: need.completedAt,
              completionReason: need.completionReason,
            };
          } catch (error) {
            console.warn('Помилка обробки потреби:', need.id, error);
            return null;
          }
        })
      );

      const validRows = needsRows.filter(Boolean);
      set({ needs: data, needsRows: validRows });

    } catch (error) {
      console.error('Помилка завантаження потреб:', error);
      set({ needs: [], needsRows: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createNeed: async (formData) => {
    try {
      const quantityNeeded = Number(formData.quantityNeeded || formData.quantity) || 1;
      const componentId = formData.componentId || formData.id;

      if (!componentId) {
        throw new Error('componentId відсутній! Перевірте row.componentId');
      }
      if (quantityNeeded < 1) {
        throw new Error('quantityNeeded має бути > 0');
      }

      const profileStore = useProfileStore.getState();
      const currentUserId = profileStore.profile?.id;

      console.log('Profile для потреби:', {
        hasProfile: !!profileStore.profile,
        userId: currentUserId
      });
      if (!currentUserId) {
        throw new Error('Авторизуйтесь для створення потреби!');
      }

      const payload = {
        componentId: componentId,
        quantityNeeded: quantityNeeded,
        requestedBy: currentUserId,
        description: formData.description?.trim() || '',
        statusId: formData.statusId,
        importanceId: formData.importanceId,
        completionReason: formData.completionReason?.trim() || '',
        performedBy: currentUserId,
      };

      const { data: newNeed } = await apiClient.post('/needs', payload);
      await get().fetchNeeds();
      return newNeed;
    } catch (error) {
      console.error('createNeed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        errors: error.response?.data?.errors
      });
      throw error;
    }
  },

  updateNeedDetails: async (needId, details) => {
    try {
       const profileStore = useProfileStore.getState();
      let currentUserId = profileStore.profile?.id;
      let attempts = 0;
      while (!currentUserId && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentUserId = useProfileStore.getState().profile?.id;
        attempts++;
      }
      if (!currentUserId) {
        throw new Error('Авторизуйтесь для редагування деталей!');
      }

      const payload = {
        id: needId,
        quantityNeeded: Number(details.quantityNeeded || details.quantity) || 0,
        description: details.description?.trim() || '',
        importanceId: details.importanceId,
        completionReason: details.completionReason?.trim() || '',
        statusId: details.statusId,
        performedBy: currentUserId,
      };

      const { data } = await apiClient.put('/needs/details', payload);
      await get().fetchNeeds();
      return data;
    } catch (error) {
      console.error('Помилка деталей:', error.response?.data || error.message);
      throw error;
    }
  },
  updateNeedStatus: async (needId, statusId) => {
    try {
      const currentNeed = get().needs.find(n => n.id === needId);
      const profileStore = useProfileStore.getState();
      const currentUserId = profileStore.profile?.id;
      if (!currentUserId) {
        throw new Error('Авторизуйтесь для зміни статусу!');
      }

      const payload = {
        id: needId,
        statusId,
        importanceId: currentNeed?.importanceId,
        performedBy: currentUserId,
      };

      const { data } = await apiClient.put('/needs/status', payload);
      await get().fetchNeeds();
      return data;
    } catch (error) {
      console.error('Помилка статусу:', error);
      throw error;
    }
  },

  updateNeedImportance: async (needId, importanceId) => {
    try {
      const profileStore = useProfileStore.getState();
      const currentUserId = profileStore.profile?.id;
      if (!currentUserId) {
        throw new Error('Авторизуйтесь для зміни пріоритету!');
      }

      const payload = {
        id: needId,
        importanceId,
        performedBy: currentUserId,
      };
      const { data } = await apiClient.put('/needs/importance', payload);
      await get().fetchNeeds();
      return data;
    } catch (error) {
      console.error('Помилка важливості:', error);
      throw error;
    }
  },

 deleteNeed: async (needId) => {
  const profileStore = useProfileStore.getState();
  const currentUserId = profileStore.profile?.id;

  if (!currentUserId) {
    throw new Error('Авторизуйтесь для видалення потреби!');
  }

  try {
    await apiClient.delete(`/needs/${needId}?performedBy=${currentUserId}`);
    await get().fetchNeeds();
  } catch (error) {
    if (error.response?.status === 500) {
      console.log('500 = Backend logging fail, record deleted');
    } else {
      console.error('Помилка видалення:', error);
      throw error;
    }
  }
},

}));

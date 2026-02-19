import { create } from 'zustand';
import apiClient from '../api/client';
import { useNeedImportancesStore } from './useNeedImportancesStore';
import { useNeedStatusesStore } from './useNeedStatusesStore';

const USER_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

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

      const payload = {
        componentId: componentId,
        quantityNeeded: quantityNeeded,
        requestedBy: USER_ID,
        description: formData.description?.trim() || '',
        statusId: formData.statusId,
        importanceId: formData.importanceId,
        completionReason: formData.completionReason?.trim() || '',
        performedBy: USER_ID,
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
      const payload = {
        id: needId,
        quantityNeeded: Number(details.quantityNeeded || details.quantity) || 0,
        description: details.description?.trim() || '',
        importanceId: details.importanceId,
        completionReason: details.completionReason?.trim() || '',
        statusId: details.statusId,
        performedBy: USER_ID,
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
      const payload = {
        id: needId,
        statusId,
        importanceId: currentNeed?.importanceId,
        performedBy: USER_ID,
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
      const payload = {
        id: needId,
        importanceId,
        performedBy: USER_ID,
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
    try {
      await apiClient.delete(`/needs/${needId}`);
      await get().fetchNeeds();
    } catch (error) {
      console.error('Помилка видалення:', error);
      throw error;
    }
  },
}));

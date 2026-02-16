import { create } from 'zustand';
import apiClient from '../api/client';

const HARDCODE_USER_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
const HARDCODE_REASON_ID = "d1f539e7-c137-42e3-81d9-920b1fb8ecd7";

export const useDamagedComponentsStore = create((set) => ({
  damagedComponents: [],
  isLoading: false,

  fetchDamagedComponents: async () => {
    set({ isLoading: true });

    try {
      const { data } = await apiClient.get('/damaged-components');
      set({ damagedComponents: data || [] });
    } catch (error) {
      console.error('[DAMAGED] API ERROR:', error.response?.data || error);
      set({ damagedComponents: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addDamagedComponent: async (componentId, reasonId, quantity) => {

    const damagedData = {
      componentId: componentId,
      reasonId: HARDCODE_REASON_ID,
      quantity: Number(quantity) || 0,
      recordedBy: HARDCODE_USER_ID
    };

    try {
      const { data } = await apiClient.post('/damaged-components', damagedData);
      
      set((state) => ({
        damagedComponents: [data, ...state.damagedComponents]
      }));
      
      return data;
    } catch (error) {
      console.error('[DAMAGED] ERROR DETAILS:', {
        status: error.response?.status,
        errors: error.response?.data?.errors,
        dataSent: damagedData
      });
      throw error;
    }
  },

  updateDamagedComponent: async (id, componentId, reasonId, quantity) => {
  const updateData = {
    id,
    componentId,
    reasonId: HARDCODE_REASON_ID,
    quantity: Number(quantity) || 0,
    updatedBy: HARDCODE_USER_ID
  };

  try {
    const { data } = await apiClient.put('/damaged-components', updateData);
    set((state) => ({
      damagedComponents: state.damagedComponents.map(item => 
        item.id === id ? data : item
      )
    }));
    return data;
  } catch (error) {
    console.error('UPDATE ERROR:', error);
    throw error;
  }
},

  deleteDamagedComponent: async (id) => {
    try {
      await apiClient.delete(`/damaged-components/${id}`);
      set((state) => ({
        damagedComponents: state.damagedComponents.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('DELETE ERROR:', error);
      throw error;
    }
  },

  clearDamagedComponents: () => set({ damagedComponents: [] })
}));

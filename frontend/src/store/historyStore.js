import { create } from 'zustand';
import { historyMock } from '../mock/historyMock';

const historyStore = create((set) => ({
  history: historyMock,
  isLoading: false,

  addHistoryRecord: (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      time: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    set((state) => ({
      history: [newRecord, ...state.history.slice(0, 100)]
    }));
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  clearHistory: () => set({ history: [] })
}));

export default historyStore;

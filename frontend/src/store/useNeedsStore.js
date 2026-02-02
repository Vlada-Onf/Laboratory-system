import { create } from 'zustand';

export const useNeedsStore = create((set) => ({
  needsRows: [],

  addNeed: (need) =>
    set((state) => ({
      needsRows: [...state.needsRows, need],
    })),
}));

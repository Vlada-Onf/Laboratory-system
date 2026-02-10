import { create } from 'zustand';

export const useNeedsStore = create((set) => ({
  needsRows: [],

  addNeed: (need) => set((state) => ({
    needsRows: [...state.needsRows, need],
  })),

  updateComponentInNeeds: (componentId, updatedComponentData) => set((state) => ({
    needsRows: state.needsRows.map(need => {
      if (need.componentId === componentId) {
        return {
          ...need,
          componentName: updatedComponentData.name,
          componentImage: updatedComponentData.image,
          categoryId: updatedComponentData.categoryId,
          category: updatedComponentData.category,
        };
      }
      return need;
    })
  })),

  removeNeedsForDeletedComponent: (componentId) => set((state) => ({
    needsRows: state.needsRows.filter(need => need.componentId !== componentId)
  })),

  updateCategoryInNeeds: (categoryId, newCategoryTitle) => set((state) => ({
    needsRows: state.needsRows.map(need => {
      if (need.categoryId === categoryId) {
        return { ...need, category: newCategoryTitle };
      }
      return need;
    })
  })),



  deleteNeed: (needId) => set((state) => ({
    needsRows: state.needsRows.filter(need => need.id !== needId)
  })),

  updateNeed: (updatedNeed) => set((state) => ({
    needsRows: state.needsRows.map(need =>
      need.id === updatedNeed.id ? { ...updatedNeed } : need
    )
  })),

  clearNeeds: () => set({ needsRows: [] }),

  sortNeeds: (sortBy) => set((state) => ({
    needsRows: [...state.needsRows].sort((a, b) => {
      if (sortBy === 'priority'){
        return b.priority - a.priority;
      }

      if (sortBy === 'quantity'){
        return b.quantity - a.quantity;
      }
      return 0;
    })
  })),
}));

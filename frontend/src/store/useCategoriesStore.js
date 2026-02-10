import { create } from 'zustand';
import { mockCategories } from '../mock/categoriesMock';
import { useComponentsStore } from './useComponentsStore';
import { useNeedsStore } from './useNeedsStore';

export const useCategoriesStore = create((set, get) => ({
  categories: mockCategories,

  addCategory: (newCategory) => set((state) => ({
    categories: [...state.categories, { id: crypto.randomUUID(), ...newCategory }]
  })),

  updateCategory: (updatedCategory) => {
    set((state) => ({
      categories: state.categories.map(cat =>
        cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
      )
    }));

    useComponentsStore.getState().updateCategoryInComponents(updatedCategory.id, updatedCategory.title);
    useNeedsStore.getState().updateCategoryInNeeds(updatedCategory.id, updatedCategory.title);
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(cat => cat.id !== id)
    }));

    useComponentsStore.getState().deleteCategoryFromComponents(id);
     useNeedsStore.getState().updateCategoryInNeeds(id, ''); 
  },

  setCategories: (categories) => set({ categories }),

  getCategoryNames: () => get().categories.map(cat => ({
    value: cat.id,
    label: cat.title,
  })),
}));
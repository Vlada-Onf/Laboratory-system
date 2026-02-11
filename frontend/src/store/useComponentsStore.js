import { create } from 'zustand';
import { componentsMock } from '../mock/componentsMock';
import { useNeedsStore } from './useNeedsStore';

export const useComponentsStore = create((set) => ({
  components: componentsMock,

  currentComponent: null,
  setCurrentComponent: (component) => set({ currentComponent: component }),
  clearCurrentComponent: () => set({ currentComponent: null }),

  updateComponent: (updatedComponent) => {
    set((state) => ({
      components: state.components.map(comp =>
        comp.id === updatedComponent.id ? { ...comp, ...updatedComponent } : comp
      )
    }));

    useNeedsStore.getState().updateComponentInNeeds(updatedComponent.id, {
      name: updatedComponent.name,
      image: updatedComponent.image,
      categoryId: updatedComponent.categoryId,
      category: updatedComponent.category,
    });
  },

  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter(comp => comp.id !== id)
    }));
  },

  addComponent: (newComponent) => {
    const fullComponent = { id: crypto.randomUUID(), ...newComponent };
    set((state) => ({ components: [...state.components, fullComponent] }));
  },

  updateCategoryInComponents: (categoryId, newCategoryTitle) => {
    set((state) => ({
      components: state.components.map(comp => {
        if (comp.categoryId === categoryId) {
          return { ...comp, category: newCategoryTitle };
        }
        return comp;
      })
    }));

    useNeedsStore.getState().updateCategoryInNeeds(categoryId, newCategoryTitle);
  },

  deleteCategoryFromComponents: (categoryId) => {
    set((state) => ({
      components: state.components.map(comp => {
        if (comp.categoryId === categoryId) {
          return { ...comp, category: '' };
        }
        return comp;
      })
    }));
  },

  setComponents: (components) => set({ components }),

  editModal: { open: false, component: null },
  openEditModal: (component) => set({ editModal: { open: true, component } }),
  closeEditModal: () => set({ editModal: { open: false, component: null } }),
}));

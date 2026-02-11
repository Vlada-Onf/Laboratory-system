import { create } from 'zustand';
import { schematicsMock } from '../mock/schematicsMock';

export const useSchematicsStore = create((set) => ({
  schematics: schematicsMock,

  editModal: { open: false, schematic: null },
  openEditModal: (schematic) => set({ editModal: { open: true, schematic } }),
  closeEditModal: () => set({ editModal: { open: false, schematic: null } }),

  addSchematic: (newSchematic) => {
    const fullSchematic = {
      id: newSchematic.id || crypto.randomUUID(),
      ...newSchematic
    };

    set((state) => ({
      schematics: [...state.schematics, fullSchematic]
    }));
  },

  updateSchematic: (updatedSchematic) => {
    set((state) => ({
      schematics: state.schematics.map(s =>
        s.id === updatedSchematic.id ? updatedSchematic : s
      )
    }));
  },

  deleteSchematic: (id) => {
    set((state) => ({
      schematics: state.schematics.filter(s => s.id !== id)
    }));
  },

  setSchematics: (schematics) => set({ schematics }),
}));

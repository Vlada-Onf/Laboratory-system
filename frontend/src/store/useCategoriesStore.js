import { create } from 'zustand';
import apiClient from '../api/client';

const COLORS = [
  '#3b82f6', 
  '#10b981', 
  '#f59e0b', 
  '#ef4444', 
  '#8b5cf6', 
  '#06b6d4', 
  '#84cc16', 
  '#ec4899'
];

export const useCategoriesStore = create((set, get) => ({
  categories: [],
  isLoading: false,

  normalizeCategory: (cat, index = 0) => {
    
    try {
      const result = {
        ...cat,
        name: cat.name === 'string' || !cat.name ? `Категорія ${index + 1}` : cat.name,
        description: cat.description === 'string' || !cat.description 
          ? `Категорія "${cat.name || 'без назви'}"` : cat.description,
        
        photoUrl: !cat.photoUrl || cat.photoUrl === 'string' || cat.photoUrl === '0' 
          ? ``
          : cat.photoUrl,
        
        cardColor: cat.cardColor === 'string' || !cat.cardColor || cat.cardColor === 'trings'
          ? COLORS[index % COLORS.length]
          : cat.cardColor
      };
      
      return result;
      
    } catch (error) {
      console.error(`Помилка нормалізації #${index}:`, error);
      return cat; // Fallback
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    
    try {
      const { data } = await apiClient.get('/categories');

      
      const normalizedCategories = (data || []).map((cat, index) => {
        return get().normalizeCategory(cat, index);
      });

      
      set({ categories: normalizedCategories });
      
    } catch (error) {
      console.error('💥 9. КРИТИЧНА ПОМИЛКА fetchCategories:');
      console.error('   Status:', error.response?.status);
      console.error('   Data:', error.response?.data);
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
      set({ categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (newCategory) => {
    try {
      const dataToSend = { ...newCategory, createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6" };
      const response = await apiClient.post('/categories', dataToSend);
      
      const normalized = get().normalizeCategory(response.data, get().categories.length);
      set((state) => ({ categories: [...state.categories, normalized] }));
      return normalized;
    } catch (error) {
      console.error('addCategory ERROR:', error);
      throw error;
    }
  },

  updateCategory: async (categoryId, updatedCategory) => {
  
  try {
    const dataToSend = {
      id: categoryId,
      name: updatedCategory.name,
      description: updatedCategory.description,
      photoUrl: updatedCategory.photoUrl || null,
      cardColor: updatedCategory.cardColor,
      lastUpdatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };
    
    
    const { data } = await apiClient.put('/categories', dataToSend);
    
    set((state) => ({
      categories: state.categories.map(cat =>
        cat.id === categoryId ? data : cat
      )
    }));
    
    return data;
  } catch (error) {
    console.error('updateCategory:', error.response?.status);
    throw error;
  }
},

  deleteCategory: async (id) => {
    
    try {
      await apiClient.delete(`/categories/${id}`);
      
      set((state) => {
        const remainingCategories = state.categories.filter(cat => cat.id !== id);
        return { categories: remainingCategories };
      });
      
      console.log('🎉 deleteCategory УСПІХ!');
      
    } catch (error) {
      console.error('deleteCategory ПОМИЛКА:');
      console.error('   Status:', error.response?.status);
      console.error('   Data:', error.response?.data);
      throw error;
    }
  },

  setCategories: (categories) => {
    
    const normalizedCategories = (categories || []).map((cat, index) => 
      get().normalizeCategory(cat, index)
    );
    
    set({ categories: normalizedCategories });
  },

  getCategoryNames: () => {
    const categories = get().categories;
    const categoryNames = categories.map(cat => ({
      value: cat.id,
      label: cat.name || 'Без назви'
    }));
    
    return categoryNames;
  }
}));

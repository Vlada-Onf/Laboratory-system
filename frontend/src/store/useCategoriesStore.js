import { create } from 'zustand';
import apiClient from '../api/client';

export const useCategoriesStore = create((set, get) => ({
  categories: [],
  isLoading: false,

  normalizeCategory: (cat, index = 0) => {
    try {
      const result = {
        ...cat,
        name: !cat.name || cat.name.trim() === '' ? `Категорія ${index + 1}` : cat.name.trim(),

        description: !cat.description || cat.description.trim() === ''
          ? `Категорія "${cat.name || 'без назви'}"` : cat.description.trim(),

        image: (() => {
          if (cat.photoUrl) return cat.photoUrl;
          if (cat.image) return cat.image;
          if (cat.image?.startsWith('data:')) return cat.image;
          return '/placeholder-category.png';
        })(),

        cardColor: cat.cardColor || '#3b82f6'
      };

      console.log(`#${index} NORMALIZED:`, {
        rawName: cat.name,
        finalName: result.name,
        rawDesc: cat.description,
        finalDesc: result.description
      });

      return result;
    } catch (error) {
      console.error(`Помилка нормалізації #${index}:`, error);
      return cat;
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/categories');

      const normalizedCategories = await Promise.all(
        (data || []).map((cat, index) =>
          Promise.resolve(get().normalizeCategory(cat, index))
        )
      );

      set({ categories: normalizedCategories });
    } catch (error) {
      console.error('fetchCategories ERROR:', error);
      set({ categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (newCategory) => {
    console.log('addCategory ОТРИМАВ:', {
      name: newCategory.name,
      description: newCategory.description,
      cardColor: newCategory.cardColor,
      fileExists: !!newCategory.photo,
      isFile: newCategory.photo instanceof File
    });

    set({ isLoading: true });

    try {
      if (!newCategory.photo || !(newCategory.photo instanceof File)) {
        throw new Error('Фото обов\'язкове! (File object)');
      }

      const formData = new FormData();
      formData.append('Name', newCategory.name);
      formData.append('Description', newCategory.description || '');
      formData.append('CardColor', newCategory.cardColor);
      formData.append('image', newCategory.photo);

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, typeof value === 'object' ? value.name || 'File' : value);
      }

      const { data } = await apiClient.post('/categories', formData);
      const normalized = get().normalizeCategory(data, get().categories.length);
      set((state) => ({ categories: [normalized, ...state.categories] }));
      console.log('Створено:', normalized);
      return normalized;

    } catch (error) {
      console.error('addCategory FAILED:', error.response?.data);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (categoryId, updatedCategory) => {
    set({ isLoading: true });

    try {
      const formData = new FormData();
      formData.append('Id', categoryId);
      formData.append('Name', updatedCategory.name);
      formData.append('Description', updatedCategory.description || '');
      formData.append('CardColor', updatedCategory.cardColor);

      if (updatedCategory.photo instanceof File) {
        formData.append('image', updatedCategory.photo);
      }

      console.log('UPDATE FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(key, typeof value === 'object' ? value.name || 'File' : value);
      }

      const { data } = await apiClient.put('/categories', formData);

      const normalized = {
        ...data,
        image: data.photoUrl || data.image || ''
      };

      set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId ? normalized : cat
        )
      }));

      return normalized;

    } catch (error) {
      console.error('updateCategory FAILED:', error.response?.data);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await apiClient.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
      console.log('Категорію видалено:', id);
    } catch (error) {
      console.error('deleteCategory FAILED:', error.response?.data || error.message);
      throw error;
    } finally {
      set({ isLoading: false });
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
    return categories.map(cat => ({
      value: cat.id,
      label: cat.name || 'Без назви'
    }));
  }
}));

import { useEffect, useCallback } from 'react';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useTagsStore } from '../store/useTagsStore';

export const useComponentData = () => {
  const categoriesStore = useCategoriesStore();
  const tagsStore = useTagsStore();
  
  const { categories, fetchCategories, isLoading: categoriesLoading } = categoriesStore;
  const { tags, fetchTags, isLoading: tagsLoading } = tagsStore;

  useEffect(() => {
    const loadData = async () => {
      if (categories.length === 0 && !categoriesLoading) {
        await fetchCategories();
      }
      if (tags.length === 0 && !tagsLoading) {
        await fetchTags();
      }
    };
    loadData();
  }, [categories.length, tags.length, categoriesLoading, tagsLoading, fetchCategories, fetchTags]);

  const getCategoryName = useCallback((categoryId) => {
    if (!categoryId) return '—';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || category?.title || '—';
  }, [categories]);

  const getTagNames = useCallback((tagIds = []) => {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return [];
    return tagIds.map(tagId => {
      const tag = tags.find(t => t.id === tagId);
      return tag?.name || tagId;
    }).filter(Boolean);
  }, [tags]);

  return {
    categories,
    tags,
    categoriesLoading,
    tagsLoading,
    isReady: categories.length > 0 || tags.length > 0,
    getCategoryName,
    getTagNames
  };
};

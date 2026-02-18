import { useEffect, useMemo } from 'react';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useTagsStore } from '@store/useTagsStore';
import { useSearchParams } from 'react-router-dom';

export const useComponentsData = () => {
  const { components, isLoading: componentsLoading, fetchComponents } = useComponentsStore();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useCategoriesStore();
  const { tags, isLoading: tagsLoading, fetchTags } = useTagsStore();
  
  const [searchParams] = useSearchParams();
  const categoryIdFilter = searchParams.get('categoryId');

  const filteredComponents = useMemo(() => {
    if (!categoryIdFilter) return components;
    return components.filter(comp => comp.categoryId === categoryIdFilter);
  }, [components, categoryIdFilter]);

  const getCategoryName = useMemo(() => (categoryId) => {
    return categories?.find(c => c.id === categoryId)?.name || '—';
  }, [categories]);

  const categoriesTagsReady = useMemo(() => 
    Boolean(categories && tags && !categoriesLoading && !tagsLoading),
  [categories, tags, categoriesLoading, tagsLoading]);

  const tableLoading = useMemo(() =>
    componentsLoading || categoriesLoading || tagsLoading || !categoriesTagsReady,
  [componentsLoading, categoriesLoading, tagsLoading, categoriesTagsReady]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.allSettled([fetchCategories(), fetchTags()]);
        if (components.length === 0 && !componentsLoading) {
          await fetchComponents();
        }
      } catch (error) {
        console.error('Помилка завантаження:', error);
      }
    };

    loadAllData();
  }, [fetchCategories, fetchTags, fetchComponents, components.length, componentsLoading]);

  return {
    components,
    filteredComponents,
    componentsLoading,
    
    categories,
    tags,
    categoriesLoading,
    tagsLoading,
    categoriesTagsReady,
    getCategoryName,
    
    tableLoading,
    categoryIdFilter
  };
};

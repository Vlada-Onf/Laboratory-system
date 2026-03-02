import { useEffect, useMemo } from 'react';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useSearchParams } from 'react-router-dom';

export const useComponentsData = () => {
  const { components, isLoading: componentsLoading, fetchComponents } = useComponentsStore();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useCategoriesStore();

  const [searchParams] = useSearchParams();
  const categoryIdFilter = searchParams.get('categoryId');

  const filteredComponents = useMemo(() => {
    if (!categoryIdFilter) return components;
    return components.filter(comp => comp.categoryId === categoryIdFilter);
  }, [components, categoryIdFilter]);

  const getCategoryName = useMemo(
    () => (categoryId) => categories?.find(c => c.id === categoryId)?.name || '—',
    [categories]
  );

  const categoriesReady = useMemo(
    () => Boolean(categories && !categoriesLoading),
    [categories, categoriesLoading]
  );

  const tableLoading = useMemo(
    () => componentsLoading || categoriesLoading || !categoriesReady,
    [componentsLoading, categoriesLoading, categoriesReady]
  );

  useEffect(() => {
    const loadTableData = async () => {
      try {
        await Promise.all([fetchCategories(), fetchComponents()]);
      } catch (error) {
        console.error('Помилка завантаження таблиці:', error);
      }
    };
    loadTableData();
  }, [fetchCategories, fetchComponents]);

  return {
    filteredComponents,
    tableLoading,
    categories,
    categoriesLoading,
    categoriesReady,
    getCategoryName,
    categoryIdFilter,
  };
};
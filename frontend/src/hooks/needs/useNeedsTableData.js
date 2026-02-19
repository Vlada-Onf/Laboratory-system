import { useState, useEffect, useMemo } from 'react';
import { useNeedsStore } from '@store/useNeedsStore';
import { useCategoriesStore } from '@store/useCategoriesStore';

export const useNeedsTableData = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { needsRows, fetchNeeds, isLoading: needsLoading } = useNeedsStore();
  const { fetchCategories, categories, isLoading: categoriesLoading } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
    fetchNeeds();
  }, [fetchCategories, fetchNeeds]);

  const categoriesMap = useMemo(() =>
    new Map(categories.map(cat => [cat.id, cat.name])),
  [categories]);

  return {
    needsRows,
    paginationModel,
    setPaginationModel,
    isLoading: needsLoading || categoriesLoading,
    getCategoryName: (categoryId) => categoriesMap.get(categoryId),
  };
};

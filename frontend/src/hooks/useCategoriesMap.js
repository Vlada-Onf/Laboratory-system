import React from 'react';
import { useCategoriesStore } from '../store/useCategoriesStore';
export const useCategoriesMap = () => {
  const categories = useCategoriesStore(state => state.categories);

  return React.useMemo(() => {
    return new Map(categories.map(cat => [cat.id, cat.name]));
  }, [categories]);
};

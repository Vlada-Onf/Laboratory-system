import { useCategoriesStore } from '../store/useCategoriesStore';
import React from 'react';
export const useCategoriesMap = () => {
  const categories = useCategoriesStore(state => state.categories);

  return React.useMemo(() => {
    return new Map(categories.map(cat => [cat.id, cat.title]));
  }, [categories]);
};

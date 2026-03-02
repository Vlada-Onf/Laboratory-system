import { useMemo } from 'react';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesStore } from '@store/useCategoriesStore';

export const useComponentsCountByCategory = (categoriesMap) => {
  const { components } = useComponentsStore();
  const { categories } = useCategoriesStore();

  return useMemo(() => {
    if (!components.length){
      return [];
    }

    const counts = components.reduce((acc, component) => {
      const categoryId = String(component.categoryId);
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([categoryId, count], index) => {
        const category = categories.find(cat => cat.id === categoryId);
        const categoryName = categoriesMap.get(categoryId) || 'Без категорії';

        return {
          id: index,
          label: categoryName.slice(0, 25),
          value: count,
          color: category?.cardColor || '#ccc'
        };
      })
      .slice(0, 8);
  }, [components, categories, categoriesMap]);
};

import { useEffect, useCallback, useMemo } from 'react';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useCategoriesMap } from '../categories/useCategoriesMap';
import { useComponentsStore } from '@store/useComponentsStore';
import { useDamagedComponentsStore } from '@store/useDamagedComponentsStore';
import { useDamagedComponentReasonsStore } from '@store/useDamagedComponentReasonsStore';

export const useBrokenComponentsData = () => {
  const { damagedComponents, isLoading, fetchDamagedComponents } = useDamagedComponentsStore();
  const { components, fetchComponents } = useComponentsStore();
  const { fetchCategories } = useCategoriesStore();
  const { reasons: damagedReasons, fetchReasons } = useDamagedComponentReasonsStore();
  const categoriesMap = useCategoriesMap();

  const reasonsMap = useMemo(() => {
    return new Map(damagedReasons.map(reason => [reason.id, reason.name]));
  }, [damagedReasons]);

  useEffect(() => {
    fetchDamagedComponents();
    fetchComponents();
    fetchCategories();
    fetchReasons();
  }, [fetchDamagedComponents, fetchComponents, fetchCategories, fetchReasons]);

  const getComponentById = useCallback((componentId) => {
    return components.find(comp => comp.id === componentId) || null;
  }, [components]);

  const enrichedRows = useMemo(() => {
    return damagedComponents.map(row => {
      const component = getComponentById(row.componentId);
      const categoryName = categoriesMap.get(component?.categoryId) || '—';
      const reasonName = reasonsMap.get(row.reasonId) || row.reasonId || '—';
      
      return {
        ...row,
        component,
        categoryName,
        reasonName
      };
    });
  }, [damagedComponents, getComponentById, categoriesMap, reasonsMap]);

  return {
    enrichedRows,
    isLoading,
    getComponentById,
    categoriesMap,
    reasonsMap
  };
};

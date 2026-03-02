import { useEffect, useMemo } from 'react';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';

export const useNeedOptions = () => {
  const categories = useCategoriesStore(state => state.categories);
  const { importances, fetchImportances } = useNeedImportancesStore();
  const { statuses, fetchStatuses } = useNeedStatusesStore();

  useEffect(() => {
    fetchImportances();
    fetchStatuses();
  }, [fetchImportances, fetchStatuses]);

  const categoryOptions = useMemo(() =>
    categories.map(cat => ({
      value: cat.id,
      label: cat.name || cat.title
    })),
  [categories]);

  const importanceOptions = useMemo(() =>
    importances.map(imp => ({
      value: imp.id,
      label: imp.name || imp.title
    })),
  [importances]);

  const statusOptions = useMemo(() =>
    statuses.map(status => ({
      value: status.id,
      label: status.name || status.title
    })),
  [statuses]);

  return {categoryOptions, importanceOptions, statusOptions};
};

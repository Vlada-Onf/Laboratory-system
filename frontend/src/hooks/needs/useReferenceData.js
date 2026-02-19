import { useEffect } from 'react';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';

export const useReferenceData = () => {
  const { fetchImportances } = useNeedImportancesStore();
  const { fetchStatuses } = useNeedStatusesStore();

  useEffect(() => {
    fetchImportances();
    fetchStatuses();
  }, [fetchImportances, fetchStatuses]);

  return null;
};

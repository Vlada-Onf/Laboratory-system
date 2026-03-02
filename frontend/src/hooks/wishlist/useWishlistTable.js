import { useState, useCallback, useEffect } from 'react';
import { useWishlistStore } from '@store/useWishlistStore';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';

export const useWishlistTable = () => {
  const { wishlistRows, isLoading, fetchAllData } = useWishlistStore();
  const { importances } = useWishlistImportancesStore();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const getImportanceName = useCallback((importanceId) =>
    importances.find(i => i.id === importanceId)?.name || 'Низька',
  [importances]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    wishlistRows,
    isLoading,
    importances,
    paginationModel,
    setPaginationModel,
    getImportanceName
  };
};

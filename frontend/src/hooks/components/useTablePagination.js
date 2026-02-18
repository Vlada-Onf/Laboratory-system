import { useState, useCallback } from 'react';

export const useTablePagination = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50
  });

  const handlePaginationChange = useCallback((newModel) => {
    setPaginationModel(newModel);
  }, []);

  return {
    paginationModel,
    setPaginationModel,
    handlePaginationChange,
    pageSizeOptions: [25, 50, 100, 200],
  };
};

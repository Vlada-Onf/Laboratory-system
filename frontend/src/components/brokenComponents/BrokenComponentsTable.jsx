import React, { useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddNeedModal from './../needsTable/AddNeedModal';
import { useBrokenComponentsData } from '../../hooks/broken/useBrokenComponentsData';
import { brokenComponentsColumns } from './BrokenComponentsColumn';

const BrokenComponentsTable = ({ onAddNeed }) => {
  const { enrichedRows, isLoading, getComponentById, categoriesMap } = useBrokenComponentsData();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenModal = useCallback((row) => {
  
  const component = getComponentById(row?.componentId);
  const fullRow = {
    ...row,
    componentId: row.componentId,
    componentName: component?.name || row.component?.name || '—',
    name: component?.name || row.component?.name || '—',
    categoryId: component?.categoryId,
    category: categoriesMap.get(component?.categoryId) || row.categoryName || '—',
  };
  
  setSelectedRow(fullRow);
  setOpenModal(true);
}, [getComponentById, categoriesMap]);


  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRow(null);
  }, []);

  const handleAddNeed = useCallback((data) => {
    const row = selectedRow;
    const component = getComponentById(row?.componentId);

    onAddNeed({
      id: Date.now(),
      componentName: component?.name || '—',
      componentImage: component?.photoUrl,
      categoryId: component?.categoryId,
      category: categoriesMap.get(component?.categoryId),
      quantity: data.quantity,
      price: data.price,
      description: data.description,
      reason: data.reason,
      priority: data.priority,
      status: 'В очікуванні',
      approvedAt: '',
    });
    handleCloseModal();
  }, [selectedRow, getComponentById, categoriesMap, onAddNeed, handleCloseModal]);

  const columns = brokenComponentsColumns(handleOpenModal);

  return (
    <>
      <div style={{ width: '100%', height: 650 }}>
        <DataGrid
          rows={enrichedRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          loading={isLoading}
          disableRowSelectionOnClick
          rowHeight={80}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
            },
            '& .MuiDataGrid-row:hover': {
            },
          }}
        />
      </div>

      <AddNeedModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddNeed}
        row={selectedRow}
      />
    </>
  );
};

export default BrokenComponentsTable;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ComponentCell from './../general/ComponentCell';
import MoveToNeedsButton from './MoveToNeedsButton';
import AddNeedModal from './AddNeedModal';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useCategoriesMap } from '../../hooks/useCategoriesMap';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useDamagedComponentsStore } from '../../store/useDamagedComponentsStore';
import { useDamagedComponentReasonsStore } from '../../store/useDamagedComponentReasonsStore';

const BrokenComponentsTable = ({ onAddNeed }) => {
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
    console.log('ENRICH:', { 
      damaged: damagedComponents.length, 
      components: components.length,
      categoriesMapSize: categoriesMap.size,
      reasonsMapSize: reasonsMap.size
    });
    
    return damagedComponents.map(row => {
      const component = getComponentById(row.componentId);
      const categoryName = categoriesMap.get(component?.categoryId) || '—';
      const reasonName = reasonsMap.get(row.reasonId) || row.reasonId || '—';
      
      console.log('ROW:', {
        componentName: component?.name,
        categoryId: component?.categoryId,
        categoryName,
        reasonId: row.reasonId,
        reasonName
      });
      
      return {
        ...row,
        component,
        categoryName,
        reasonName
      };
    });
  }, [damagedComponents, components, categoriesMap, getComponentById, reasonsMap]);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenModal = useCallback((row) => {
    setSelectedRow(row);
    setOpenModal(true);
  }, []);

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

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ComponentCell 
          image={params.row.component?.photoUrl} 
          name={params.row.component?.name || '—'} 
        />
      ),
    },
    {
      field: 'categoryName',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.row.categoryName || '—'}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Кількість',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography fontWeight={600}>
          {params.value} шт
        </Typography>
      ),
    },
    {
      field: 'reason',
      headerName: 'Причина',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.row.reasonName || '—'}
        </Typography>
      ),
    },
    {
      field: 'lastUpdatedAt',
      headerName: 'Дата оновлення',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const dateValue = params.row.lastUpdatedAt || params.row.recordedAt;
        if (!dateValue) return <Typography>—</Typography>;
        const date = new Date(dateValue);
        return (
          <Typography variant="body2" fontWeight={500}>
            {date.toLocaleDateString('uk-UA')} {date.toLocaleTimeString('uk-UA', { 
              hour: '2-digit', minute: '2-digit' 
            })}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <MoveToNeedsButton 
            onMoveToNeeds={() => handleOpenModal(params.row)}
            label="До потреб"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ height: 650, width: '100%' }}>
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
                backgroundColor: '#f8f9ff',
              },
            }}
          />
        </div>
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

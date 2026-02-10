import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ComponentCell from '../general/ComponentCell';
import StatusChip from '../general/StatusChip';
import PriorityChip from '../general/ImportanceChip';
import { useCategoriesMap } from '../../hooks/useCategoriesMap';
import { useNeedsStore } from '../../store/useNeedsStore';

const NeedsTable = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

const needsRows = useNeedsStore((state) => state.needsRows);

const categoriesMap = useCategoriesMap();

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2.2,
      minWidth: 220,
      renderCell: (params) => (
        <ComponentCell
          image={params.row.componentImage}
          name={params.row.componentName}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
    <Typography variant="body2">
      {categoriesMap.get(params.row.categoryId) || params.row.category || '—'}
    </Typography>),
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
      field: 'price',
      headerName: 'Ціна',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography fontWeight={600}>
          {params.value ? `${params.value} ₴` : '—'}
        </Typography>
      ),
    },
    {
      field: 'priority',
      headerName: 'Важливість',
      flex: 1.1,
      minWidth: 110,
      renderCell: (params) => (
        <PriorityChip priority={params.row.priority} />
      ),
    },
    {
      field: 'description',
      headerName: 'Опис',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'reason',
      headerName: 'Причина',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 1.3,
      minWidth: 120,
      renderCell: (params) => (
        <StatusChip status={params.row.status} />
      ),
    },
    {
      field: 'approvedAt',
      headerName: 'Затверджено',
      flex: 1.2,
      minWidth: 120,
    },
  ];

  return (
    <div style={{ height: 580, width: '100%' }}>
      <DataGrid
        rows={needsRows}
        columns={columns}
        rowHeight={90}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
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
          },
        }}
      />
    </div>
  );
};

export default NeedsTable;

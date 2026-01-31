import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ComponentCell from './../general/ComponentCell';
import MoveToNeedsButton from './MoveToNeedsButton';
import { brokenComponentsMock } from '../../mock/brokenComponentsMock';

const BrokenComponentsTable = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ComponentCell
          image={params.row.image}
          name={params.row.name}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || '—'}
        </Typography>
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
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
          }}
        >
          {params.value || '—'}
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
        field: 'actions',
        headerName: '',
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <MoveToNeedsButton
                onMoveToNeeds={() => console.log('Move to needs', params.row.id)}
            />
        ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 550, width: '100%' }}>
        <DataGrid
          rows={brokenComponentsMock}
          columns={columns}
          rowHeight={100}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          columnReordering
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
    </div>
  );
};

export default BrokenComponentsTable;

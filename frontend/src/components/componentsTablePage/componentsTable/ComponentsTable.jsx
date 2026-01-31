import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ClickableComponentCell from './ClickableComponentCell';
import LinkBadge from './../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';
import { useComponentNavigation } from '../../../hooks/useComponentNavigation';
import { componentsMock } from '../../../mock/componentsMock';

const ComponentsTable = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const { goToComponentPage } = useComponentNavigation();

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ClickableComponentCell
          row={params.row}
          onClick={(id) => goToComponentPage(id)}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || '—'}</Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Опис',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'docLink',
      headerName: 'Документація',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <LinkBadge url={params.value} color="#08273b" />
      ),
    },
    {
      field: 'quantity',
      headerName: 'К-сть',
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value} шт</Typography>
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
      field: 'tags',
      headerName: 'Теги',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => <TagsCell value={params.value} />,
    },
    {
      field: 'rowActions',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ButtonsCell
          onEdit={() => console.log('edit', params.row.id)}
          onMoveToNeeds={() => console.log('move to needs', params.row.id)}
          onDelete={() => console.log('delete', params.row.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <ComponentsTableToolbar
        onAddComponent={() => console.log('add component')}
        onImportExcel={() => console.log('import excel')}
      />
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={componentsMock}
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

export default ComponentsTable;

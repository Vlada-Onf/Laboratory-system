import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import ComponentCell from './../general/ComponentCell';
import { brokenComponentsMock } from '../../mock/brokenComponentsMock';
import MoveToNeedsButton from './MoveToNeedsButton';
import AddNeedModal from './AddNeedModal';
import { useCategoriesMap } from '../../hooks/useCategoriesMap';

const BrokenComponentsTable = ({ onAddNeed }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const categoriesMap = useCategoriesMap();

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleAddNeed = (data) => {
  const mappedNeed = {
    id: Date.now(),
    componentName: data.name,
    componentImage: data.image,
    categoryId: selectedRow.categoryId,
    category: data.category,
    quantity: data.quantity,
    price: data.price,
    description: data.description,
    reason: data.reason,
    priority: data.priority,
    status: 'В очікуванні',
    approvedAt: '',
  };

  onAddNeed(mappedNeed);
  handleCloseModal();
};

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ComponentCell image={params.row.image} name={params.row.name} />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <Typography variant="body2">
      {categoriesMap.get(params.row.categoryId) || params.row.category || '—'}
    </Typography>,
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
          sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}
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
      renderCell: (params) => <Typography fontWeight={600}>{params.value} шт</Typography>,
    },
    {
      field: 'price',
      headerName: 'Ціна',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value ? `${params.value} ₴` : '—'}</Typography>
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
      onMoveToNeeds={() => handleOpenModal(params.row)}
    />
  ),
}

  ];

    return (
    <>
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

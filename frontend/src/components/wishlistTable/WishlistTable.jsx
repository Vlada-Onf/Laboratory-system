import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ComponentCell from '../general/ComponentCell';
import PriorityChip from '../general/ImportanceChip';
import StatusChip from '../general/StatusChip';
import MoveToNeedsButton from './../brokenComponents/MoveToNeedsButton';
import AddNeedModal from './../brokenComponents/AddNeedModal';
import { Typography } from '@mui/material';


const rows = [
  {
    id: 1,
    componentImage: 'https://minicomp.com.ua/image/catalog/upload/3051885-40.jpg',
    componentName: 'Raspberry Pi 4',
    category: 'Плати',
    quantity: 2,
    price: 2500,
    description: 'Для курсового проекту',
    status: 'Затверджено',
    reason: 'Необхідно для лабораторії',
    approvedAt: '2026-01-11',
    priority: 'Середня',
  },
];

const WishlistTable = ({ onAddNeed }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleAddNeed = (formData) => {
    if (!selectedRow){
      return;
    }

    const mappedNeed = {
      id: Date.now(),
      componentName: selectedRow.componentName,
      componentImage: selectedRow.componentImage,
      category: selectedRow.category,
      quantity: formData.quantity,
      price: formData.price,
      description: formData.description || selectedRow.description,
      reason: formData.reason,
      priority: formData.priority,
      status: 'В очікуванні',
      approvedAt: '',
    };

    onAddNeed?.(mappedNeed);
    handleCloseModal();
  };

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2.2,
      minWidth: 220,
      renderCell: (params) => (
        <ComponentCell image={params.row.componentImage} name={params.row.componentName} />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <Typography variant="body2">{params.value || '—'}</Typography>,
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
        <Typography fontWeight={600}>
          {params.value ? `${params.value} ₴` : '—'}
        </Typography>
      ),
    },
    {
      field: 'priority',
      headerName: 'Важливість',
      flex: 1.1,
      minWidth: 100,
      renderCell: (params) => <PriorityChip priority={params.row.priority} />,
    },
    { field: 'description', headerName: 'Опис', flex: 2, minWidth: 220 },
    { field: 'reason', headerName: 'Причина', flex: 2, minWidth: 220 },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 1.3,
      minWidth: 120,
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
    { field: 'approvedAt', headerName: 'Затверджено', flex: 1.2, minWidth: 120 },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <MoveToNeedsButton onMoveToNeeds={() => handleOpenModal(params.row)} />
      ),
    },
  ];

  return (
    <div style={{ height: 580, width: '100%' }}>
      <DataGrid
        rows={rows}
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

      <AddNeedModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddNeed}
        row={selectedRow}
      />
    </div>
  );
};

export default WishlistTable;

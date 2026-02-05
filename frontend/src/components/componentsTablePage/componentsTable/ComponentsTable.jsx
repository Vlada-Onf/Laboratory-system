import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import ClickableComponentCell from './ClickableComponentCell';
import LinkBadge from './../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';
import AddNeedModal from '../../brokenComponents/AddNeedModal';
import { componentsMock } from '../../../mock/componentsMock';
import { useNavigate } from 'react-router-dom';


const ComponentsTable = ({ onAddNeed }) => {
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
      componentName: selectedRow.name,
      componentImage: selectedRow.image,
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

  const navigate = useNavigate();

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ClickableComponentCell
          image={params.row.image}
          name={params.row.name}
          id={params.row.id}
          onClick={(id) => navigate(`/components/${id}`)}
        />
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
      renderCell: (params) => <LinkBadge url={params.value} color="#08273b" />,
    },
    {
      field: 'quantity',
      headerName: 'К-сть',
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) => <Typography fontWeight={600}>{params.value} шт</Typography>,
    },
    {
      field: 'price',
      headerName: 'Ціна',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <Typography fontWeight={600}>{params.value ? `${params.value} ₴` : '—'}</Typography>,
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
          onMoveToNeeds={() => handleOpenModal(params.row)}
          onDelete={() => console.log('delete', params.row.id)}
        />
      ),
    },
  ];

  return (
    <Box>
      <ComponentsTableToolbar
      />
      <Box sx={{ height: 560, width: '100%' }}>
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
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
          }}
        />
      </Box>

      <AddNeedModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddNeed}
        row={selectedRow}
      />
    </Box>
  );
};

export default ComponentsTable;

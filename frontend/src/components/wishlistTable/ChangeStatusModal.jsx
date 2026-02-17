import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PriorityChip from './PriorityChip';
import StatusChip from './StatusChip';
import ChangeStatusModal from './ChangeStatusModal'; 
import { useWishlistStore } from '@store/useWishlistStore';
import AddWishlistModal from './AddWishlistModal';
import ConfirmDeleteModal from '../general/ConfirmDeleteModal';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';

const WishlistTable = () => {
  const { wishlistRows, isLoading, fetchAllData } = useWishlistStore();
  const { importances } = useWishlistImportancesStore();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusWishlistId, setStatusWishlistId] = useState(null);
  const [currentStatusId, setCurrentStatusId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getImportanceName = (importanceId) => {
    return importances.find(i => i.id === importanceId)?.name || 'Низька';
  };

  const handleStatusClick = (wishlistId, statusId) => {
    setStatusWishlistId(wishlistId);
    setCurrentStatusId(statusId);
    setOpenStatusModal(true);
  };

  const handleOpenModal = (row) => {
    setSelectedRow(row || { id: 'new', name: 'Новий запис' });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleOpenDeleteModal = (id, name) => {
    setDeleteRowId(id);
    setSelectedRow({ name });
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteRowId(null);
    setSelectedRow(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteRowId) {
      try {
        await useWishlistStore.getState().deleteWishlist(deleteRowId);
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    handleCloseDeleteModal();
  };

  if (!wishlistRows.length) {
    return (
      <Box sx={{ height: 510, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Завантажуємо список бажань...</Typography>
      </Box>
    );
  }

  const columns = [
    { field: 'name', headerName: 'Компонент', flex: 1.5 },
    { 
      field: 'quantityNeeded', 
      headerName: 'Кількість', 
      flex: 0.8,
      renderCell: ({ value }) => <Typography fontWeight={600}>{value} шт</Typography>
    },
    { 
      field: 'priority', 
      headerName: 'Важливість', 
      flex: 1,
      renderCell: ({ row }) => <PriorityChip priority={getImportanceName(row.importanceId)} /> 
    },
    { field: 'description', headerName: 'Опис', flex: 2, minWidth: 200 },
    {
      field: 'status',
      headerName: 'Статус', 
      flex: 1,
      renderCell: ({ row }) => (
        <StatusChip 
          statusId={row.statusId}
          wishlistId={row.id}
          onStatusClick={() => handleStatusClick(row.id, row.statusId)}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Редагувати"
          onClick={() => handleOpenModal(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Видалити"
          onClick={() => handleOpenDeleteModal(params.id, params.row.name)}
          color="error"
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal({ id: 'new', name: 'Виберіть компонент' })}
        >
          Додати до списку
        </Button>
      </Box>

      <Box sx={{ height: 510, width: '100%' }}>
        <DataGrid
          rows={wishlistRows}
          getRowId={(row) => row.id}
          columns={columns}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
            },
          }}
        />
      </Box>

      <AddWishlistModal open={openModal} onClose={handleCloseModal} row={selectedRow} />
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        entityName={selectedRow?.name || 'запис'}
        entityTypeName="Запис у списку бажань"
      />
      
      <ChangeStatusModal
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        wishlistId={statusWishlistId}
        currentStatusId={currentStatusId}
      />
    </Box>
  );
};

export default WishlistTable;

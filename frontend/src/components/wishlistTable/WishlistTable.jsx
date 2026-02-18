import React from 'react';
import { Box, Typography } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityChip from './PriorityChip';
import StatusChip from './StatusChip';
import AddWishlistModal from './AddWishlistModal';
import ConfirmDeleteModal from '../general/ConfirmDeleteModal';
import ChangeStatusModal from './ChangeStatusModal';
import WishlistTableToolbar from './WishlistTableToolbar';
import WishlistDataGrid from './WishlistDataGrid';
import { useWishlistTable } from '../../hooks/wishlist/useWishlistTable';
import { useWishlistModals } from '../../hooks/wishlist/useWishlistModals';


const WishlistTable = () => {
  const wishlistTableData = useWishlistTable();
  const wishlistModals = useWishlistModals();

  if (!wishlistTableData.wishlistRows.length) {
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
      renderCell: ({ row }) => (
        <PriorityChip priority={wishlistTableData.getImportanceName(row.importanceId)} />
      )
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
          onStatusClick={() => wishlistModals.openStatusModalHandler(row.id, row.statusId)}
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
          onClick={() => wishlistModals.openAddModal(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Видалити"
          onClick={() => wishlistModals.openDeleteModal(params.id, params.row.name)}
          color="error"
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box>
      <WishlistTableToolbar onAddClick={() => wishlistModals.openAddModal({ id: 'new' })} />
      
      <WishlistDataGrid
        wishlistRows={wishlistTableData.wishlistRows}
        columns={columns}
        paginationModel={wishlistTableData.paginationModel}
        onPaginationModelChange={wishlistTableData.setPaginationModel}
        isLoading={wishlistTableData.isLoading}
        getImportanceName={wishlistTableData.getImportanceName}
        modals={wishlistModals}
      />

      <AddWishlistModal 
        open={wishlistModals.addModal.open}
        onClose={wishlistModals.closeAddModal}
        row={wishlistModals.addModal.selectedRow} 
      />
      
      <ConfirmDeleteModal
        open={wishlistModals.deleteModal.open}
        onClose={wishlistModals.closeDeleteModal}
        onConfirm={wishlistModals.handleConfirmDelete}
        entityName={wishlistModals.deleteModal.selectedRow?.name || 'запис'}
        entityTypeName="Запис у списку бажань"
      />
      
      <ChangeStatusModal
        openStatusModal={wishlistModals.statusModal.open}
        statuses={wishlistModals.statusModal.statuses}
        newStatusId={wishlistModals.statusModal.newStatusId}
        currentStatusId={wishlistModals.statusModal.currentStatusId}
        completionReason={wishlistModals.statusModal.completionReason}
        isSavingStatus={wishlistModals.statusModal.isSavingStatus}
        onClose={wishlistModals.closeStatusModal}
        onSubmit={wishlistModals.handleStatusSubmit}
        onStatusChange={wishlistModals.updateStatusField}
        onReasonChange={wishlistModals.updateStatusField}
      />
    </Box>
  );
};

export default WishlistTable;

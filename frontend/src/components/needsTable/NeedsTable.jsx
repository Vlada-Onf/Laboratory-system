import { Box, Typography } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import ComponentCell from '../general/ComponentCell';
import StatusChip from './StatusChip';
import PriorityChip from './PriorityChip';
import UpdateNeedModal from './UpdateNeedModal';
import ConfirmDeleteModal from '../general/ConfirmDeleteModal';
import ChangePriorityModal from './ChangePriorityModal';
import { useNeedsTableData } from '../../hooks/needs/useNeedsTableData';
import { useNeedsModals } from '../../hooks/needs/useNeedsModals';
import { useReferenceData } from '../../hooks/needs/useReferenceData';

const NeedsTable = () => {
  const tableData = useNeedsTableData();
  const modals = useNeedsModals();
  useReferenceData();

  if (!tableData.needsRows.length) {
    return (
      <Box sx={{ height: 510, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Завантажуємо потреби...</Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2.2,
      minWidth: 220,
      renderCell: ({ row }) => (
        <ComponentCell
          image={row.componentImage}
          name={row.componentName}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1.2,
      minWidth: 140,
      renderCell: ({ row }) => (
        <Typography variant="body2">
          {tableData.getCategoryName(row.categoryId) || row.category || '—'}
        </Typography>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Кількість',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography fontWeight={600} color="primary.main">
          {row.quantity} шт
        </Typography>
      ),
    },
    {
      field: 'priority',
      headerName: 'Пріоритет',
      flex: 1.1,
      minWidth: 110,
      renderCell: ({ row }) => (
        <PriorityChip
          priorityId={row.importanceId}
          onPriorityClick={() => modals.openPriorityModalHandler(row.id, row.importanceId)}
        />
      ),
    },
    {
      field: 'reason',
      headerName: 'Причина',
      flex: 2,
      minWidth: 220,
      renderCell: ({ row }) => {
        const parts = row.description?.split(' | ') || [];
        const reason = parts[0] || row.description || '—';
        return (
          <Typography variant="body2" sx={{
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {reason}
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Опис',
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => {
        const parts = row.description?.split(' | ') || [];
        const pureDesc = parts[parts.length - 1]?.replace(/Ціна:.*$/, '') || '—';
        return (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {pureDesc}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 1.3,
      minWidth: 120,
      renderCell: ({ row }) => (
        <StatusChip statusId={row.statusId} />
      ),
    },
    {
      field: 'requestedAt',
      headerName: 'Запис додано',
      flex: 1.2,
      minWidth: 120,
      renderCell: ({ value }) => {
        if (!value) return <Typography>—</Typography>;
        try {
          const date = new Date(value);
          return (
            <Typography variant="body2">
              {date.toLocaleDateString('uk-UA')}
            </Typography>
          );
        } catch {
          return <Typography>—</Typography>;
        }
      },
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Редагувати"
          onClick={() => modals.openEditModal(params.row)} 
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Видалити"
          onClick={() => modals.openDeleteModal(params.id, `потріб ${params.row.componentName}`)}
          color="error"
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%', height: 555 }}>
      <DataGrid
        rows={tableData.needsRows}
        columns={columns}
        paginationModel={tableData.paginationModel}
        onPaginationModelChange={tableData.setPaginationModel}
        isLoading={tableData.isLoading}
        pageSizeOptions={[5, 10, 20]}
        rowHeight={90}
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
            borderBottom: '2px solid #e0e0e0'
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f8f9ff'
          }
        }}
      />

      <UpdateNeedModal
        open={modals.editModal?.open || false}
        row={modals.editModal?.need}
        onClose={modals.closeEditModal}
      />

      <ConfirmDeleteModal
        open={modals.deleteModal.open}
        onClose={modals.closeDeleteModal}
        onConfirm={modals.handleConfirmDelete}
        entityName={modals.deleteModal.selectedRow?.componentName || 'запис'}
        entityTypeName="Потреби"
      />

      <ChangePriorityModal
        openPriorityModal={modals.priorityModal.open}
        importances={modals.priorityModal.importances}
        newPriorityId={modals.priorityModal.newPriorityId}
        currentPriorityId={modals.priorityModal.currentPriorityId}
        completionReason={modals.priorityModal.completionReason}
        isSavingPriority={modals.priorityModal.isSavingPriority}
        onClose={modals.closePriorityModal}
        onSubmit={modals.handlePrioritySubmit}
        onPriorityChange={modals.updatePriorityField}
        onReasonChange={modals.updatePriorityField}
      />
    </Box>
  );
};

export default NeedsTable;

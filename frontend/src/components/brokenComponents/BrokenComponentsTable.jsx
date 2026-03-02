import { useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddNeedModal from './../needsTable/AddNeedModal';
import { useBrokenComponentsData } from '../../hooks/broken/useBrokenComponentsData';
import { useDamagedComponentsStore } from '../../store/useDamagedComponentsStore';
import { brokenComponentsColumns } from './BrokenComponentsColumn';
import DeleteConfirmModal from './DeleteConfirmModal';

const BrokenComponentsTable = ({ onAddNeed }) => {
  const { enrichedRows, isLoading, getComponentById, categoriesMap } = useBrokenComponentsData();
  const { deleteDamagedComponent } = useDamagedComponentsStore();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenModal = useCallback((row) => {
    const component = getComponentById(row?.componentId);
    const fullRow = {
      ...row,
      componentId: row.componentId,
      componentName: component?.name || row.component?.name || '—',
      name: component?.name || row.component?.name || '—',
      categoryId: component?.categoryId,
      category: categoriesMap.get(component?.categoryId) || row.categoryName || '—',
    };

    setSelectedRow(fullRow);
    setOpenModal(true);
  }, [getComponentById, categoriesMap]);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRow(null);
  }, []);

  const handleDelete = useCallback((damagedId) => {
    setDeletingId(damagedId);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return;

    setDeleteLoading(true);
    try {
      await deleteDamagedComponent(deletingId);
    } catch (error) {
      console.error('Помилка видалення:', error);
      alert('Помилка видалення запису');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  }, [deletingId, deleteDamagedComponent]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeletingId(null);
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

  const columns = brokenComponentsColumns(handleOpenModal, handleDelete);

  return (
    <>
      <div style={{ width: '100%', height: 550 }}>
        <DataGrid
          rows={enrichedRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[50, 100, 200]}
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
          }}
        />
      </div>

      <AddNeedModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddNeed}
        row={selectedRow}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Видалити запис про пошкодження?"
        description="Цей запис буде безповоротно видалено."
        itemName={enrichedRows.find(row => row.id === deletingId)?.component?.name}
        loading={deleteLoading}
      />
    </>
  );
};

export default BrokenComponentsTable;

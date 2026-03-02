import { useCallback } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useComponentsData } from '../../../hooks/components/useComponentData';
import { useTableModals } from '../../../hooks/components/useTableModals';
import { useTablePagination } from '../../../hooks/components/useTablePagination';
import { useComponentsStore } from '@store/useComponentsStore';
import { useExcelExport } from '../../../hooks/components/useExcelExport';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import ComponentsColumns  from './ComponentsColumns';
import ComponentsTableToolbar from '../ComponentsTableToolbar';
import AddNeedModal from '../../needsTable/AddNeedModal';
import ComponentModal from '../../component/componentBlock/ComponentModal';
import ConfirmDeleteModal from '../../general/confirmDeleteModal';

const ComponentsTable = ({ onAddNeed }) => {
  const navigate = useNavigate();
  const { isLab, canSeeToolbar } = useUserPermissions();

  const {
    filteredComponents,
    tableLoading,
    categories,
    categoriesLoading,
    categoriesReady,
    getCategoryName
  } = useComponentsData();

  const {
    openModal,
    selectedRow,
    handleOpenModal,
    handleCloseModal,
    deleteModalOpen,
    componentToDelete,
    handleDeleteClick,
    handleCloseDeleteModal,
  } = useTableModals();

  const {
    paginationModel,
    handlePaginationChange,
    pageSizeOptions
  } = useTablePagination();

  const {
    addComponent,
    updateComponent,
    deleteComponent,
    editModal,
    openEditModal,
    closeEditModal,
    fetchComponents
  } = useComponentsStore();

  const isEditing = Boolean(editModal.component);

  const { exportToExcel } = useExcelExport(filteredComponents, getCategoryName);

  const handleExportExcel = useCallback(() => {
    exportToExcel('компоненти');
  }, [exportToExcel]);

  const columns = ComponentsColumns({
    categories,
    categoriesLoading,
    categoriesTagsReady: categoriesReady,
    onComponentClick: (id) => navigate(`/front-components/${id}`),
    onEdit: openEditModal,
    onDelete: handleDeleteClick,
    onMoveToNeeds: handleOpenModal,
    showActions: !isLab
  });

  const handleSubmit = useCallback(async (formData, file) => {
    try {
      if (isEditing) {
        await updateComponent(editModal.component.id, formData, file);
      } else {
        await addComponent(formData, file);
      }

      closeEditModal();
      fetchComponents();
    } catch (error) {
      console.error('Помилка:', error);
    }
  }, [
    isEditing,
    editModal.component,
    addComponent,
    updateComponent,
    closeEditModal,
    fetchComponents
  ]);

  const handleAddNeed = useCallback((formData) => {
    if (!selectedRow || !onAddNeed){
      return;
    }

    onAddNeed({
      id: Date.now(),
      componentId: selectedRow.id,
      componentName: selectedRow.name,
      componentImage: selectedRow.photoUrl,
      categoryId: selectedRow.categoryId,
      category: getCategoryName(selectedRow.categoryId),
      quantity: formData.quantity,
      price: formData.price,
      description: formData.description || selectedRow.description,
      reason: formData.reason,
      priority: formData.priority,
      status: 'В очікуванні',
      approvedAt: ''
    });

    handleCloseModal();
  }, [selectedRow, onAddNeed, getCategoryName, handleCloseModal]);

  const handleDeleteConfirm = useCallback(() => {
    if (componentToDelete) {
      deleteComponent(componentToDelete.id);
    }
    handleCloseDeleteModal();
  }, [componentToDelete, deleteComponent, handleCloseDeleteModal]);

  return (
    <Box>

     {canSeeToolbar && (
        <ComponentsTableToolbar
          onAddComponent={() => openEditModal(null)}
          onExportExcel={handleExportExcel}
        />
      )}

      <Box sx={{ height: 550, width: '100%' }}>
<DataGrid
  rows={filteredComponents}
  columns={columns}
  rowHeight={100}
  loading={tableLoading}
  paginationModel={paginationModel}
  onPaginationModelChange={handlePaginationChange}
  pageSizeOptions={pageSizeOptions}
  disableRowSelectionOnClick
  columnReordering
  sx={{
    '& .MuiDataGrid-cell': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      lineHeight: 1.4,
      py: 1
    },
    '& .MuiDataGrid-cell[data-field="rowActions"]': {
      justifyContent: 'center'
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f5f5f5',
      borderBottom: '2px solid #e0e0e0',
      alignItems: 'center'
    },
    '& .MuiDataGrid-pagination': {
      justifyContent: 'center',
      '& .MuiPaginationItem-root': {
        margin: '0 2px',
        minWidth: '40px'
      },
      '& .MuiPaginationItem-active': {
        backgroundColor: '#1976d2',
        color: 'white'
      }
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'action.hover'
    }
  }}
/>

      </Box>

      {!isLab && (
        <>
          <ComponentModal
            key={editModal.component?.id || 'add'}
            open={editModal.open}
            onClose={closeEditModal}
            onSubmit={handleSubmit}
            component={editModal.component}
            isEditing={isEditing}
          />

          <AddNeedModal
            open={openModal}
            onClose={handleCloseModal}
            onAdd={handleAddNeed}
            row={selectedRow}
          />

          <ConfirmDeleteModal
            open={deleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteConfirm}
            entityName={componentToDelete?.name}
            entityTypeId={4}
            entityTypeName="Компонент"
          />
        </>
      )}
    </Box>
  );
};

export default ComponentsTable;
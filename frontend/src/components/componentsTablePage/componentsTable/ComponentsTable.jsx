import React, { useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useComponentsData } from '../../../hooks/components/useComponentData';
import { useTableModals } from '../../../hooks/components/useTableModals';
import { useTablePagination } from '../../../hooks/components/useTablePagination';
import { useComponentsStore } from '@store/useComponentsStore';
import { useExcelExport } from '../../../hooks/components/useExcelExport';
import ClickableComponentCell from './ClickableComponentCell';
import LinkBadge from './../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';
import CategoryCell from './CategoryCell';
import AddNeedModal from '../../needsTable/AddNeedModal';
import ComponentModal from '../../component/componentBlock/ComponentModal';
import ConfirmDeleteModal from '../../general/confirmDeleteModal';

const ComponentsTable = ({ onAddNeed }) => {
  const navigate = useNavigate();
  const {
    filteredComponents,
    tableLoading,
    categories,
    categoriesLoading,
    categoriesTagsReady,
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

  const handleComponentClick = useCallback((id) => {
  navigate(`/front-components/${id}`);
}, [navigate]);

  const columns = useMemo(() => [
    { 
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: ({ row }) => (
        <ClickableComponentCell
          image={row.photoUrl}
          name={row.name}
          id={row.id}
          onClick={handleComponentClick}
        />
      )
    },
    {
      field: 'category',
      headerName: 'Категорія',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) => (
        <CategoryCell
          categoryId={row.categoryId}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesLoaded={categoriesTagsReady}
        />
      )
    },
    { field: 'description', headerName: 'Опис', flex: 2, minWidth: 220 },
    {
      field: 'documentationLink',
      headerName: 'Документація',
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ value }) => <LinkBadge url={value} color="#08273b" />
    },
    {
      field: 'quantity',
      headerName: 'К-сть',
      flex: 0.8,
      minWidth: 80,
      renderCell: ({ value }) => <Typography fontWeight={600}>{value} шт</Typography>
    },
    {
      field: 'price',
      headerName: 'Ціна',
      flex: 1,
      minWidth: 100,
      renderCell: ({ value }) => <Typography fontWeight={600}>{value ? `${value} ₴` : '—'}</Typography>
    },
    {
      field: 'tags',
      headerName: 'Теги',
      flex: 1.5,
      minWidth: 150,
      renderCell: ({ row }) => <TagsCell value={row.tags} />
    },
    {
      field: 'rowActions',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <ButtonsCell
          row={row}
          onEdit={() => openEditModal(row)}
          onDelete={() => handleDeleteClick(row)}
          onMoveToNeeds={() => handleOpenModal(row)}
        />
      )
    }
  ], [categories, categoriesLoading, categoriesTagsReady, openEditModal, handleDeleteClick, handleOpenModal,
  handleComponentClick]);

  const handleSubmit = useCallback(async (formData, file) => {
    try {
      if (isEditing) {
        const id = editModal.component.id;
        await updateComponent(id, formData, file);
      } else {
        await addComponent(formData, file);
      }
      closeEditModal();
      fetchComponents();
    } catch (error) {
      console.error('Помилка:', error);
    }
  }, [isEditing, editModal.component, addComponent, updateComponent, closeEditModal, fetchComponents]);

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
    if (componentToDelete) deleteComponent(componentToDelete.id);
    handleCloseDeleteModal();
  }, [componentToDelete, deleteComponent, handleCloseDeleteModal]);

  return (
    <Box>
      <ComponentsTableToolbar
        onAddComponent={() => openEditModal(null)}
        onImportExcel={() => console.log('import excel')}
        onExportExcel={handleExportExcel}
      />
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
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4
            },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
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
            }
          }}
        />
      </Box>

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
    </Box>
  );
};

export default ComponentsTable;

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ClickableComponentCell from './ClickableComponentCell';
import LinkBadge from './../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';
import AddNeedModal from '../../brokenComponents/AddNeedModal';
import ComponentModal from '../../component/componentBlock/ComponentModal';
import { useComponentsStore } from '@store/useComponentsStore';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useTagsStore } from '@store/useTagsStore';
import ConfirmDeleteModal from '../../general/ConfirmDeleteModal';

const TagsCellLoader = React.memo(({ componentId, allTags }) => {
  const { getComponentTags } = useTagsStore();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const componentTags = await getComponentTags(componentId);
        if (isMounted) {
          setTags(componentTags || []);
        }
      } catch {
        if (isMounted) {
          setError('Помилка завантаження тегів');
          setTags([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTags();

    return () => {
      isMounted = false;
    };
  }, [componentId, getComponentTags]);

  if (loading) {
    return <CircularProgress size={16} />;
  }

  if (error) {
    return <Typography variant="caption" color="error">—</Typography>;
  }

  return <TagsCell tags={tags} allTags={allTags} />;
});

const ComponentsTable = ({ onAddNeed }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryIdFilter = searchParams.get('categoryId');

  const {
    components,
    isLoading,
    fetchComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    editModal,
    openEditModal,
    closeEditModal,
  } = useComponentsStore();

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  const { fetchTags, tags,  } = useTagsStore();
  const { fetchCategories, categories, isLoading: categoriesLoading } = useCategoriesStore();

  const filteredComponents = useMemo(() => {
    if (!categoryIdFilter) return components;
    return components.filter(comp => comp.categoryId === categoryIdFilter);
  }, [components, categoryIdFilter]);

  
  const isEditing = Boolean(editModal.component);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await fetchCategories();
        setCategoriesLoaded(true);

        await fetchTags();
        setTagsLoaded(true);

        await fetchComponents();
      } catch (error) {
        console.error('Помилка повного завантаження:', error);
      }
    };

    loadAllData();
  }, [fetchCategories, fetchTags, fetchComponents]);

 
  const handleOpenModal = useCallback((row) => {
    setSelectedRow(row);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRow(null);
  }, []);

  const handleDeleteClick = useCallback((row) => {
    setComponentToDelete(row);
    setDeleteModalOpen(true);
  }, []);

  const handleAddNeed = useCallback((formData) => {
    if (!selectedRow) return;

    const mappedNeed = {
      id: Date.now(),
      componentId: selectedRow.id,
      componentName: selectedRow.name,
      componentImage: selectedRow.photoUrl,
      categoryId: selectedRow.categoryId,
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
  }, [selectedRow, onAddNeed, handleCloseModal]);

  const handleAddComponentSubmit = useCallback(async (formData) => {
    try {
      await addComponent(formData);
      closeEditModal();
    } catch (error) {
      console.error('Помилка додавання:', error);
    }
  }, [addComponent, closeEditModal]);

  const handleComponentSubmit = useCallback(async (formData) => {
    try {
      const componentId = editModal.component.id;
      await updateComponent(componentId, formData);
      closeEditModal();
    } catch (error) {
      console.error('Помилка оновлення:', error);
    }
  }, [editModal.component, updateComponent, closeEditModal]);

  const columns = useMemo(() => [
    {
      field: 'component',
      headerName: 'Компонент',
      flex: 2,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => (
        <ClickableComponentCell
          image={params.row.photoUrl}
          name={params.row.name}
          id={params.row.id}
          onClick={(id) => navigate(`/front-components/${id}`)}
        />
      ),
    },
    {
    field: 'category',
    headerName: 'Категорія',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
      if (!categoriesLoaded || categoriesLoading) {
        return <CircularProgress size={16} />;
      }
      const categoryName = categories?.find(c => c.id === params.row.categoryId)?.name || '—';
      return <Typography variant="body2">{categoryName}</Typography>;
    },
  },
    {
      field: 'description',
      headerName: 'Опис',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'documentationLink',
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
  renderCell: (params) => <TagsCell value={params.row.tags} />,
},


    {
      field: 'rowActions',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ButtonsCell
          row={params.row}
          onEdit={() => openEditModal(params.row)}
          onDelete={() => handleDeleteClick(params.row)}
          onMoveToNeeds={() => handleOpenModal(params.row)}
        />
      ),
    },
  ], [categories, categoriesLoaded, categoriesLoading, navigate, tags, openEditModal, handleDeleteClick, handleOpenModal]);
  
  const tableLoading = isLoading || categoriesLoading || !categoriesLoaded || !tagsLoaded;

  return (
    <Box>
      
      
      <ComponentsTableToolbar
        onAddComponent={() => openEditModal(null)}
        onImportExcel={() => console.log('import excel')}
      />
      
      <Box sx={{ height: 550, width: '100%' }}>
        <DataGrid
          rows={filteredComponents}
          columns={columns}
          rowHeight={100}
          loading={tableLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
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
          }}
        />
      </Box>

      <ComponentModal
        key={editModal.component?.id || 'add'}
        open={editModal.open}
        onClose={closeEditModal}
        onSubmit={isEditing ? handleComponentSubmit : handleAddComponentSubmit}
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
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (componentToDelete) {
            deleteComponent(componentToDelete.id);
          }
          setDeleteModalOpen(false);
          setComponentToDelete(null);
        }}
        entityName={componentToDelete?.name}
        entityTypeId={4}
        entityTypeName="Компонент"
      />
    </Box>
  );
};

export default ComponentsTable;

import React, { useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import ClickableComponentCell from './ClickableComponentCell';
import LinkBadge from './../../component/linksBlock/LinkBadge';
import TagsCell from './TagsCell';
import ButtonsCell from './ButtonsCell';
import ComponentsTableToolbar from './../ComponentsTableToolbar';
import AddNeedModal from '../../brokenComponents/AddNeedModal';
import ComponentModal from '../../component/componentBlock/ComponentModal';
import { useComponentsStore } from '../../../store/useComponentsStore';
import { useCategoriesStore } from '../../../store/useCategoriesStore';
import { useNavigate } from 'react-router-dom';

const ComponentsTable = ({ onAddNeed }) => {
  const {
    components,
    updateComponent,
    deleteComponent,
    addComponent,
    editModal,
    openEditModal,
    closeEditModal,
  } = useComponentsStore();


  const categories = useCategoriesStore(state => state.categories);

  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const navigate = useNavigate();
const isEditing = Boolean(editModal.component);

  const handleOpenModal = useCallback((row) => {
    setSelectedRow(row);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRow(null);
  }, []);

  const handleAddNeed = useCallback((formData) => {
  if (!selectedRow){
    return;
  }

  const mappedNeed = {
    id: Date.now(),
    componentId: selectedRow.id,
    componentName: selectedRow.name,
    componentImage: selectedRow.image,
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

  console.log('NEED READY FOR TABLE:', mappedNeed);
  onAddNeed?.(mappedNeed);
  handleCloseModal();
}, [selectedRow, onAddNeed, handleCloseModal]);

const handleAddComponentSubmit = useCallback((formData) => {
  addComponent({
    ...formData,

    id: crypto.randomUUID(),
    docLink: '',
    buyLink: '',
    otherLinks: [],

    schemes: [],
  });

  closeEditModal();
}, [addComponent, closeEditModal]);


  const handleComponentSubmit = useCallback((formData) => {
    const originalComponent = editModal.component;
    const fullData = {
      ...originalComponent,
      ...formData,
    };
    console.log('🔄 MERGE DATA:', {
      preservedDocLink: originalComponent?.docLink,
      updatedName: formData.name,
      finalData: fullData
    });
    updateComponent(fullData);
    closeEditModal();
  }, [editModal.component, updateComponent, closeEditModal]);

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
  renderCell: (params) => {
    const categoryName = categories?.find(c => c.id === params.row.categoryId)?.title
                       || params.row.category
                       || '—';
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
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ButtonsCell
          onEdit={() => openEditModal(params.row)}
          onDelete={() => deleteComponent(params.row.id)}
          onMoveToNeeds={() => handleOpenModal(params.row)}
        />
      ),
    },
  ];

  return (
    <Box>
      <ComponentsTableToolbar
        onAddComponent={() => openEditModal(null)}
        onImportExcel={() => console.log('import excel')}
      />
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={components}
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
    </Box>
  );
};

export default ComponentsTable;

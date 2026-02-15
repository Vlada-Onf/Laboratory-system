import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SchematicCard from './SchematicCard';
import AddSchematicCard from './AddSchematicCard';
import SchematicModal from './SchematicModal';
import { useSchematicsStore } from '../../../store/useSchematicsStore';

const SchematicsBlock = ({ componentId, onAddSchematic }) => {
  const {
    schematics,
    isLoading,
    fetchSchematicsByComponent,
    editModal,
    openEditModal,
    closeEditModal,
    updateSchematic,
    deleteSchematic,
    addSchematic
  } = useSchematicsStore();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  useEffect(() => {
    if (componentId) {
      fetchSchematicsByComponent(componentId);
    }
  }, [componentId, fetchSchematicsByComponent]);

  const componentSchematics = schematics.filter(s => 
    String(s.componentId) === String(componentId)
  );

  const handleEditSchematic = (schematic) => {
    openEditModal(schematic);
  };

  const handleOpenDeleteConfirm = (id, title) => {
    setDeleteItemId(id);
    setDeleteItemTitle(title);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      deleteSchematic(deleteItemId);
    }
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
    setDeleteItemTitle('');
  };

  const handleAddSchematic = () => {
    openEditModal(null);
    onAddSchematic?.();
  };

  const handleSaveSchematic = async (schematicData) => {
    try {
      if (editModal.schematic) {
        await updateSchematic(schematicData);
      } else {
        schematicData.componentId = String(componentId);
        await addSchematic(schematicData);
      }
      closeEditModal();
    } catch (error) {
      console.error('Помилка збереження схеми:', error);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Завантаження...</Box>;
  }

  return (
    <>
      <Box sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {componentSchematics.length > 0 ? (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 2,
            p: 2, pt: 3
          }}>
            {componentSchematics.map((schematic) => (
              <SchematicCard
                key={schematic.id}
                id={schematic.id}
                title={schematic.title}
                photoUrl={schematic.photoUrl}
                schematic={schematic}
                onEdit={handleEditSchematic}
                onDelete={handleOpenDeleteConfirm}
              />
            ))}
            <AddSchematicCard onAdd={handleAddSchematic} />
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 3,
            minHeight: 200
          }}>
            <AddSchematicCard onAdd={handleAddSchematic} />
          </Box>
        )}
      </Box>

      {editModal.open && (
        <SchematicModal
          key={editModal.schematic?.id || `add-${componentId}`}
          open={editModal.open}
          schematic={editModal.schematic}
          componentId={componentId}
          onClose={closeEditModal}
          onSave={handleSaveSchematic}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Підтвердити видалення</DialogTitle>
        <DialogContent>
          Ви впевнені, що хочете видалити схему "<strong>{deleteItemTitle}</strong>"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Скасувати</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SchematicsBlock;

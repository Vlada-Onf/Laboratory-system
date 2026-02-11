import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import SchematicCard from './SchematicCard';
import AddSchematicCard from './AddSchematicCard.jsx';
import SchematicModal from './SchematicModal.jsx';
import { useSchematicsStore } from '../../../store/useSchematicStore';

const SchematicsBlock = ({ componentId }) => {
  const {
    schematics,
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

  const componentSchematics = schematics.filter(s => {
    return String(s.componentId) === String(componentId);
  });

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

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
    setDeleteItemTitle('');
  };

  const handleAddSchematic = () => {
    openEditModal(null);
  };

  const handleSaveSchematic = (schematicData) => {
    if (editModal.schematic) {
      updateSchematic(schematicData);
    } else {
      schematicData.componentId = String(componentId);
      addSchematic(schematicData);
    }
    closeEditModal();
  };

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
                links={schematic.links}
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
        <>
          <SchematicModal
            key={editModal.schematic?.id || `add-${componentId}`}
            open={editModal.open}
            schematic={editModal.schematic}
            componentId={componentId}
            onClose={closeEditModal}
            onSave={handleSaveSchematic}
          />
        </>
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Підтвердити видалення</DialogTitle>
        <DialogContent>
          Ви впевнені, що хочете видалити схему "<strong>{deleteItemTitle}</strong>"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Скасувати</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SchematicsBlock;

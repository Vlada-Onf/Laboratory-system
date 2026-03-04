import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SchematicCard from './SchematicCard';
import AddSchematicCard from './AddSchematicCard';
import SchematicModal from './SchematicModal';
import { useSchematicsStore } from '@store/useSchematicsStore';
import { useAuthStore } from '@store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const SchematicsBlock = ({ componentId, onAddSchematic }) => {
  const {
    schematics,
    isLoading,
    fetchSchematicsByComponent,
  } = useSchematicsStore();

  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId) roles.push(user.roleId);
    if (user?.roles && Array.isArray(user.roles)) roles.push(...user.roles);
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');

  React.useEffect(() => {
    if (componentId) {
      fetchSchematicsByComponent(componentId);
    }
  }, [componentId, fetchSchematicsByComponent]);

  const componentSchematics = schematics.filter(s => 
    String(s.componentId) === String(componentId)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchematic, setEditingSchematic] = useState(null);

  const handleEditSchematic = (schematic) => {
    setEditingSchematic(schematic);
    setModalOpen(true);
  };

  const handleOpenDeleteConfirm = (id, title) => {
    setDeleteItemId(id);
    setDeleteItemTitle(title);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItemId) {
      try {
        await useSchematicsStore.getState().deleteSchematic(deleteItemId);
        console.log('Схема видалена');
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
    setDeleteItemTitle('');
  };

  const handleAddSchematic = () => {
    setEditingSchematic(null);
    setModalOpen(true);
    onAddSchematic?.();
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
    setEditingSchematic(null);
    if (componentId) {
      await fetchSchematicsByComponent(componentId);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Завантаження...</Box>;
  }

  const showAddSchematicCard = !isLabRole;

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
                isLabRole={isLabRole}
              />
            ))}
            {showAddSchematicCard && <AddSchematicCard onAdd={handleAddSchematic} />}
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 3,
            minHeight: 200
          }}>
            {showAddSchematicCard && <AddSchematicCard onAdd={handleAddSchematic} />}
          </Box>
        )}
      </Box>

      <SchematicModal
        open={modalOpen}
        schematic={editingSchematic}
        componentId={componentId}
        onClose={handleCloseModal}
      />

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

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, Typography, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useEntityTypesStore } from '@store/useEntityTypesStore';

const EntitiesModal = ({ open, onClose }) => {
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityDescription, setNewEntityDescription] = useState('');
  
  const { 
    entityTypes, 
    isLoading, 
    fetchEntityTypes, 
    addEntityType, 
    updateEntityType, 
    deleteEntityType 
  } = useEntityTypesStore();

  useEffect(() => {
    if (open) fetchEntityTypes();
  }, [open, fetchEntityTypes]);

  const handleAddEntity = async () => {
    if (!newEntityName.trim() || !newEntityDescription.trim()) return;
    try {
      await addEntityType({ 
        name: newEntityName, 
        description: newEntityDescription 
      });
      setNewEntityName(''); 
      setNewEntityDescription('');
    } catch (error) {
      console.error('Помилка додавання сутності:', error);
    }
  };

  const handleUpdateEntity = async (entityId, name, description) => {
    try {
      await updateEntityType(entityId, { 
        id: entityId, 
        name, 
        description 
      });
    } catch (error) {
      console.error('Помилка оновлення сутності:', error);
    }
  };

  const handleDeleteEntity = async (entityId) => {
    try {
      await deleteEntityType(entityId);
    } catch (error) {
      console.error('Помилка видалення сутності:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Сутності
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
            <TextField 
              label="Назва сутності" 
              value={newEntityName} 
              onChange={(e) => setNewEntityName(e.target.value)} 
              size="small" 
              fullWidth 
            />
            <TextField 
              label="Опис" 
              value={newEntityDescription} 
              onChange={(e) => setNewEntityDescription(e.target.value)} 
              size="small" 
              fullWidth 
            />
            <IconButton 
              onClick={handleAddEntity} 
              disabled={!newEntityName.trim() || !newEntityDescription.trim()} 
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : entityTypes.length === 0 ? (
              <Typography color="text.secondary">Сутностей немає</Typography>
            ) : (
              entityTypes.map((entity) => (
                <Box 
                  key={entity.id} 
                  sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    alignItems: 'center', 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    mb: 1 
                  }}
                >
                  <TextField 
                    value={entity.name} 
                    onChange={(e) => handleUpdateEntity(entity.id, e.target.value, entity.description)} 
                    size="small" 
                    sx={{ flex: 1 }} 
                  />
                  <TextField 
                    value={entity.description} 
                    onChange={(e) => handleUpdateEntity(entity.id, entity.name, e.target.value)} 
                    size="small" 
                    sx={{ flex: 2 }} 
                  />
                  <IconButton 
                    onClick={() => handleDeleteEntity(entity.id)} 
                    size="small" 
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntitiesModal;

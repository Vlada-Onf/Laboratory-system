import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent,TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useEntityTypesStore } from '@store/useEntityTypesStore';

const EntitiesModal = ({ open, onClose }) => {
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityDescription, setNewEntityDescription] = useState('');
  
  const { entityTypes, isLoading, fetchEntityTypes, addEntityType, updateEntityType, deleteEntityType } = 
    useEntityTypesStore();

  useEffect(() => {
    if (open) fetchEntityTypes();
  }, [open, fetchEntityTypes]);

  const handleSaveEntity = useCallback(async (entityId = null, name, description) => {
    try {
      if (entityId) {
        await updateEntityType(entityId, { id: entityId, name, description });
      } else {
        await addEntityType({ name, description });
        setNewEntityName('');
        setNewEntityDescription('');
      }
    } catch (error) {
      console.error('Помилка збереження сутності:', error);
    }
  }, [addEntityType, updateEntityType]);

  const handleDeleteEntity = useCallback(async (entityId) => {
    try {
      await deleteEntityType(entityId);
    } catch (error) {
      console.error('Помилка видалення сутності:', error);
    }
  }, [deleteEntityType]);

  const isAddDisabled = !newEntityName.trim() || !newEntityDescription.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Сутності
        <IconButton 
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="Закрити"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'end', mb: 3 }}>
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
            onClick={() => handleSaveEntity(null, newEntityName, newEntityDescription)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати сутність"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : entityTypes.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Сутностей немає
            </Typography>
          ) : (
            entityTypes.map((entity) => (
              <Box 
                key={entity.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={entity.name} 
                  onChange={(e) => handleSaveEntity(entity.id, e.target.value, entity.description)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <TextField 
                  value={entity.description} 
                  onChange={(e) => handleSaveEntity(entity.id, entity.name, e.target.value)}
                  size="small" 
                  sx={{ flex: 2 }} 
                />
                <IconButton 
                  onClick={() => handleDeleteEntity(entity.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити сутність"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(EntitiesModal);

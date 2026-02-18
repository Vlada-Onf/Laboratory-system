import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useActionsStore } from '@store/useActionsStore';

const ActionsModal = ({ open, onClose }) => {
  const [newActionName, setNewActionName] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
 
  
  const { actions, isLoading, fetchActions, addAction, updateAction, deleteAction } = useActionsStore();

  useEffect(() => {
    if (open) fetchActions();
  }, [open, fetchActions]);

  const handleSaveAction = useCallback(async (actionId = null, name, description) => {
    try {
      if (actionId) {
        await updateAction(actionId, { id: actionId, name, description });
      } else {
        await addAction({ name, description });
        setNewActionName('');
        setNewActionDescription('');
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
    }
  }, [addAction, updateAction]);

  const handleDeleteAction = useCallback(async (actionId) => {
    try {
      await deleteAction(actionId);
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  }, [deleteAction]);

  const isAddDisabled = !newActionName.trim() || !newActionDescription.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Дії
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
            label="Назва дії" 
            value={newActionName} 
            onChange={(e) => setNewActionName(e.target.value)}
            size="small" 
            fullWidth 
          />
          <TextField 
            label="Опис" 
            value={newActionDescription} 
            onChange={(e) => setNewActionDescription(e.target.value)}
            size="small" 
            fullWidth 
          />
          <IconButton 
            onClick={() => handleSaveAction(null, newActionName, newActionDescription)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати дію"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : actions.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Дій немає
            </Typography>
          ) : (
            actions.map((action) => (
              <Box 
                key={action.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={action.name} 
                  onChange={(e) => handleSaveAction(action.id, e.target.value, action.description)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <TextField 
                  value={action.description} 
                  onChange={(e) => handleSaveAction(action.id, action.name, e.target.value)}
                  size="small" 
                  sx={{ flex: 2 }} 
                />
                <IconButton 
                  onClick={() => handleDeleteAction(action.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити дію"
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

export default React.memo(ActionsModal);

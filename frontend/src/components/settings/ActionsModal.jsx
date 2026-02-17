import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, Typography, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useActionsStore } from '@store/useActionsStore';

const ActionsModal = ({ open, onClose }) => {
  const [newActionName, setNewActionName] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  
  const { 
    actions, 
    isLoading, 
    fetchActions, 
    addAction, 
    updateAction, 
    deleteAction 
  } = useActionsStore();

  useEffect(() => {
    if (open) fetchActions();
  }, [open, fetchActions]);

  const handleAddAction = async () => {
    if (!newActionName.trim() || !newActionDescription.trim()) return;
    try {
      await addAction({ 
        name: newActionName, 
        description: newActionDescription 
      });
      setNewActionName(''); 
      setNewActionDescription('');
    } catch (error) {
      console.error('Помилка додавання дії:', error);
    }
  };

  const handleUpdateAction = async (actionId, name, description) => {
    try {
      await updateAction(actionId, { 
        id: actionId, 
        name, 
        description 
      });
    } catch (error) {
      console.error('Помилка оновлення дії:', error);
    }
  };

  const handleDeleteAction = async (actionId) => {
    try {
      await deleteAction(actionId);
    } catch (error) {
      console.error('Помилка видалення дії:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Дії
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
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
              onClick={handleAddAction} 
              disabled={!newActionName.trim() || !newActionDescription.trim()} 
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : actions.length === 0 ? (
              <Typography color="text.secondary">Дій немає</Typography>
            ) : (
              actions.map((action) => (
                <Box 
                  key={action.id} 
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
                    value={action.name} 
                    onChange={(e) => handleUpdateAction(action.id, e.target.value, action.description)} 
                    size="small" 
                    sx={{ flex: 1 }} 
                  />
                  <TextField 
                    value={action.description} 
                    onChange={(e) => handleUpdateAction(action.id, action.name, e.target.value)} 
                    size="small" 
                    sx={{ flex: 2 }} 
                  />
                  <IconButton 
                    onClick={() => handleDeleteAction(action.id)} 
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

export default ActionsModal;

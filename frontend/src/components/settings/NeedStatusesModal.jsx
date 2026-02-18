import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';

const NeedStatusesModal = ({ open, onClose }) => {
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');
  
  const { statuses, isLoading, fetchStatuses, addStatus, updateStatus, deleteStatus } = 
    useNeedStatusesStore();

  useEffect(() => {
    if (open) fetchStatuses();
  }, [open, fetchStatuses]);

  const handleSaveStatus = useCallback(async (statusId = null, name, description) => {
    try {
      if (statusId) {
        await updateStatus(statusId, { id: statusId, name, description });
      } else {
        await addStatus({ name, description });
        setNewStatusName('');
        setNewStatusDescription('');
      }
    } catch (error) {
      console.error('Помилка збереження статусу:', error);
    }
  }, [addStatus, updateStatus]);

  const handleDeleteStatus = useCallback(async (statusId) => {
    try {
      await deleteStatus(statusId);
    } catch (error) {
      console.error('Помилка видалення статусу:', error);
    }
  }, [deleteStatus]);

  const isAddDisabled = !newStatusName.trim() || !newStatusDescription.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Статуси потреб
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
            label="Назва"
            value={newStatusName} 
            onChange={(e) => setNewStatusName(e.target.value)}
            size="small" 
            fullWidth 
          />
          <TextField 
            label="Опис"
            value={newStatusDescription} 
            onChange={(e) => setNewStatusDescription(e.target.value)}
            size="small" 
            fullWidth 
          />
          <IconButton 
            onClick={() => handleSaveStatus(null, newStatusName, newStatusDescription)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати статус"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : statuses.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Статусів немає
            </Typography>
          ) : (
            statuses.map((status) => (
              <Box 
                key={status.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={status.name} 
                  onChange={(e) => handleSaveStatus(status.id, e.target.value, status.description)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <TextField 
                  value={status.description} 
                  onChange={(e) => handleSaveStatus(status.id, status.name, e.target.value)}
                  size="small" 
                  sx={{ flex: 2 }} 
                />
                <IconButton 
                  onClick={() => handleDeleteStatus(status.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити статус"
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

export default React.memo(NeedStatusesModal);

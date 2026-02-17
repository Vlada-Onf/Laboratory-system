import React, { useState, useEffect } from 'react';
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField, 
  IconButton, 
  Box, 
  Typography,
  Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';

const WishlistStatusesModal = ({ open, onClose }) => {
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');
  
  const { 
    statuses, 
    isLoading, 
    fetchStatuses, 
    addStatus, 
    updateStatus, 
    deleteStatus 
  } = useWishlistStatusesStore();

  useEffect(() => {
    if (open) {
      fetchStatuses();
    }
  }, [open, fetchStatuses]);

  const handleAddStatus = async () => {
    if (!newStatusName.trim() || !newStatusDescription.trim()) return;
    
    try {
      await addStatus({
        name: newStatusName,
        description: newStatusDescription
      });
      setNewStatusName('');
      setNewStatusDescription('');
    } catch (error) {
      console.error('Помилка додавання статусу:', error);
    }
  };

  const handleUpdateStatus = async (statusId, name, description) => {
    try {
      await updateStatus(statusId, { id: statusId, name, description });
    } catch (error) {
      console.error('Помилка оновлення статусу:', error);
    }
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      await deleteStatus(statusId);
    } catch (error) {
      console.error('Помилка видалення статусу:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Статуси списку бажаного
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
            <TextField
              label="Назва статусу"
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
              onClick={handleAddStatus}
              disabled={!newStatusName.trim() || !newStatusDescription.trim()}
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : statuses.length === 0 ? (
              <Typography color="text.secondary">Статусів немає</Typography>
            ) : (
              statuses.map((status) => (
                <Box 
                  key={status.id} 
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
                    value={status.name}
                    onChange={(e) => handleUpdateStatus(status.id, e.target.value, status.description)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={status.description}
                    onChange={(e) => handleUpdateStatus(status.id, status.name, e.target.value)}
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <IconButton
                    onClick={() => handleDeleteStatus(status.id)}
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

export default WishlistStatusesModal;

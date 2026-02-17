import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, Typography, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useDamagedComponentReasonsStore } from '@store/useDamagedComponentReasonsStore';

const DamagedComponentReasonsModal = ({ open, onClose }) => {
  const [newReasonName, setNewReasonName] = useState('');
  const [newReasonDescription, setNewReasonDescription] = useState('');
  
  const { 
    reasons, 
    isLoading, 
    fetchReasons, 
    addReason, 
    updateReason, 
    deleteReason 
  } = useDamagedComponentReasonsStore();

  useEffect(() => {
    if (open) {
      fetchReasons();
    }
  }, [open, fetchReasons]);

  const handleAddReason = async () => {
    if (!newReasonName.trim() || !newReasonDescription.trim()) return;
    
    try {
      await addReason({
        name: newReasonName,
        description: newReasonDescription
      });
      setNewReasonName('');
      setNewReasonDescription('');
    } catch (error) {
      console.error('Помилка додавання причини:', error);
    }
  };

  const handleUpdateReason = async (reasonId, name, description) => {
    try {
      await updateReason(reasonId, { 
        id: reasonId, 
        name, 
        description 
      });
    } catch (error) {
      console.error('Помилка оновлення причини:', error);
    }
  };

  const handleDeleteReason = async (reasonId) => {
    try {
      await deleteReason(reasonId);
    } catch (error) {
      console.error('Помилка видалення причини:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Причини зламаних компонентів
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
              label="Назва причини"
              value={newReasonName}
              onChange={(e) => setNewReasonName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Опис"
              value={newReasonDescription}
              onChange={(e) => setNewReasonDescription(e.target.value)}
              size="small"
              fullWidth
            />
            <IconButton
              onClick={handleAddReason}
              disabled={!newReasonName.trim() || !newReasonDescription.trim()}
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : reasons.length === 0 ? (
              <Typography color="text.secondary">Причин немає</Typography>
            ) : (
              reasons.map((reason) => (
                <Box 
                  key={reason.id} 
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
                    value={reason.name}
                    onChange={(e) => handleUpdateReason(reason.id, e.target.value, reason.description)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={reason.description}
                    onChange={(e) => handleUpdateReason(reason.id, reason.name, e.target.value)}
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <IconButton
                    onClick={() => handleDeleteReason(reason.id)}
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

export default DamagedComponentReasonsModal;

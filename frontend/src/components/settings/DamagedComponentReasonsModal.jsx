import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useDamagedComponentReasonsStore } from '@store/useDamagedComponentReasonsStore';

const DamagedComponentReasonsModal = ({ open, onClose }) => {
  const [newReasonName, setNewReasonName] = useState('');
  const [newReasonDescription, setNewReasonDescription] = useState('');
  
  const { reasons, isLoading, fetchReasons, addReason, updateReason, deleteReason } = 
    useDamagedComponentReasonsStore();

  useEffect(() => {
    if (open) fetchReasons();
  }, [open, fetchReasons]);

  const handleSaveReason = useCallback(async (reasonId = null, name, description) => {
    try {
      if (reasonId) {
        await updateReason(reasonId, { id: reasonId, name, description });
      } else {
        await addReason({ name, description });
        setNewReasonName('');
        setNewReasonDescription('');
      }
    } catch (error) {
      console.error('Помилка збереження причини:', error);
    }
  }, [addReason, updateReason]);

  const handleDeleteReason = useCallback(async (reasonId) => {
    try {
      await deleteReason(reasonId);
    } catch (error) {
      console.error('Помилка видалення причини:', error);
    }
  }, [deleteReason]);

  const isAddDisabled = !newReasonName.trim() || !newReasonDescription.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Причини зламаних компонентів
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
            onClick={() => handleSaveReason(null, newReasonName, newReasonDescription)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати причину"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : reasons.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Причин немає
            </Typography>
          ) : (
            reasons.map((reason) => (
              <Box 
                key={reason.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={reason.name} 
                  onChange={(e) => handleSaveReason(reason.id, e.target.value, reason.description)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <TextField 
                  value={reason.description} 
                  onChange={(e) => handleSaveReason(reason.id, reason.name, e.target.value)}
                  size="small" 
                  sx={{ flex: 2 }} 
                />
                <IconButton 
                  onClick={() => handleDeleteReason(reason.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити причину"
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

export default React.memo(DamagedComponentReasonsModal);

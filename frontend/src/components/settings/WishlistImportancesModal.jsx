import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, Typography, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';

const WishlistImportancesModal = ({ open, onClose }) => {
  const [newImportanceName, setNewImportanceName] = useState('');
  const [newImportanceLevel, setNewImportanceLevel] = useState(0);
  
  const { 
    importances, 
    isLoading, 
    fetchImportances, 
    addImportance, 
    updateImportance, 
    deleteImportance 
  } = useWishlistImportancesStore();

  useEffect(() => {
    if (open) {
      fetchImportances();
    }
  }, [open, fetchImportances]);

  const handleAddImportance = async () => {
    if (!newImportanceName.trim()) return;
    
    try {
      await addImportance({
        name: newImportanceName,
        level: parseInt(newImportanceLevel)
      });
      setNewImportanceName('');
      setNewImportanceLevel(0);
    } catch (error) {
      console.error('Помилка додавання рівня важливості:', error);
    }
  };

  const handleUpdateImportance = async (impId, name, level) => {
    try {
      await updateImportance(impId, { 
        id: impId, 
        name, 
        level: parseInt(level) 
      });
    } catch (error) {
      console.error('Помилка оновлення рівня важливості:', error);
    }
  };

  const handleDeleteImportance = async (impId) => {
    try {
      await deleteImportance(impId);
    } catch (error) {
      console.error('Помилка видалення рівня важливості:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Рівні важливості списку бажаного
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
              label="Назва рівня"
              value={newImportanceName}
              onChange={(e) => setNewImportanceName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Рівень (число)"
              type="number"
              value={newImportanceLevel}
              onChange={(e) => setNewImportanceLevel(e.target.value)}
              size="small"
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
            <IconButton
              onClick={handleAddImportance}
              disabled={!newImportanceName.trim()}
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : importances.length === 0 ? (
              <Typography color="text.secondary">Рівнів важливості немає</Typography>
            ) : (
              importances.map((imp) => (
                <Box 
                  key={imp.id} 
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
                    value={imp.name}
                    onChange={(e) => handleUpdateImportance(imp.id, e.target.value, imp.level)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={imp.level}
                    type="number"
                    onChange={(e) => handleUpdateImportance(imp.id, imp.name, e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    inputProps={{ min: 0, step: 1 }}
                  />
                  <IconButton
                    onClick={() => handleDeleteImportance(imp.id)}
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

export default WishlistImportancesModal;

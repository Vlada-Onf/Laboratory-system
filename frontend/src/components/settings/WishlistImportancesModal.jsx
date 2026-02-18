import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent,TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';

const WishlistImportancesModal = ({ open, onClose }) => {
  const [newImportanceName, setNewImportanceName] = useState('');
  const [newImportanceLevel, setNewImportanceLevel] = useState(0);
  
  const { importances, isLoading, fetchImportances, addImportance, updateImportance, deleteImportance } = 
    useWishlistImportancesStore();

  useEffect(() => {
    if (open){
      fetchImportances();
    }
  }, [open, fetchImportances]);

  const handleSaveImportance = useCallback(async (impId = null, name, level) => {
    try {
      const levelNum = parseInt(level);
      if (isNaN(levelNum) || levelNum < 0){
        return;
      }
      
      if (impId) {
        await updateImportance(impId, { id: impId, name, level: levelNum });
      } else {
        await addImportance({ name, level: levelNum });
        setNewImportanceName('');
        setNewImportanceLevel(0);
      }
    } catch (error) {
      console.error('Помилка збереження рівня важливості:', error);
    }
  }, [addImportance, updateImportance]);

  const handleDeleteImportance = useCallback(async (impId) => {
    try {
      await deleteImportance(impId);
    } catch (error) {
      console.error('Помилка видалення рівня важливості:', error);
    }
  }, [deleteImportance]);

  const isAddDisabled = !newImportanceName.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Рівні важливості списку бажаного
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
            onClick={() => handleSaveImportance(null, newImportanceName, newImportanceLevel)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати рівень важливості"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : importances.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Рівнів важливості немає
            </Typography>
          ) : (
            importances.map((imp) => (
              <Box 
                key={imp.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={imp.name} 
                  onChange={(e) => handleSaveImportance(imp.id, e.target.value, imp.level)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <TextField 
                  value={imp.level} 
                  type="number"
                  onChange={(e) => handleSaveImportance(imp.id, imp.name, e.target.value)}
                  size="small" 
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, step: 1 }}
                />
                <IconButton 
                  onClick={() => handleDeleteImportance(imp.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити рівень важливості"
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

export default React.memo(WishlistImportancesModal);

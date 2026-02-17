import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Box, Typography, Button
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useRolesStore } from '@store/useRolesStore';

const RolesModal = ({ open, onClose }) => {
  const [newRoleName, setNewRoleName] = useState('');
  
  const { 
    roles, 
    isLoading, 
    fetchRoles, 
    addRole, 
    updateRole, 
    deleteRole 
  } = useRolesStore();

  useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await addRole({ name: newRoleName });
      setNewRoleName('');
    } catch (error) {
      console.error('Помилка додавання ролі:', error);
    }
  };

  const handleUpdateRole = async (roleId, name) => {
    try {
      await updateRole(roleId, { id: roleId, name });
    } catch (error) {
      console.error('Помилка оновлення ролі:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      await deleteRole(roleId);
    } catch (error) {
      console.error('Помилка видалення ролі:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Список ролей
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
            <TextField 
              label="Назва ролі" 
              value={newRoleName} 
              onChange={(e) => setNewRoleName(e.target.value)} 
              size="small" 
              fullWidth 
            />
            <IconButton 
              onClick={handleAddRole} 
              disabled={!newRoleName.trim()} 
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography>Завантаження...</Typography>
            ) : roles.length === 0 ? (
              <Typography color="text.secondary">Ролей немає</Typography>
            ) : (
              roles.map((role) => (
                <Box 
                  key={role.id} 
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
                    value={role.name} 
                    onChange={(e) => handleUpdateRole(role.id, e.target.value)} 
                    size="small" 
                    sx={{ flex: 1 }} 
                  />
                  <IconButton 
                    onClick={() => handleDeleteRole(role.id)} 
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
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolesModal;

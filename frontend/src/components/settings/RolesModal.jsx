import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useRolesStore } from '@store/useRolesStore';

const RolesModal = ({ open, onClose }) => {
  const [newRoleName, setNewRoleName] = useState('');
  
  const { roles, isLoading, fetchRoles, addRole, updateRole, deleteRole } = useRolesStore();

  useEffect(() => {
    if (open) fetchRoles();
  }, [open, fetchRoles]);

  const handleSaveRole = useCallback(async (roleId = null, name) => {
    try {
      if (roleId) {
        await updateRole(roleId, { id: roleId, name });
      } else {
        await addRole({ name });
        setNewRoleName('');
      }
    } catch (error) {
      console.error('Помилка збереження ролі:', error);
    }
  }, [addRole, updateRole]);

  const handleDeleteRole = useCallback(async (roleId) => {
    try {
      await deleteRole(roleId);
    } catch (error) {
      console.error('Помилка видалення ролі:', error);
    }
  }, [deleteRole]);

  const isAddDisabled = !newRoleName.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Список ролей
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
            label="Назва ролі"
            value={newRoleName} 
            onChange={(e) => setNewRoleName(e.target.value)}
            size="small" 
            fullWidth 
          />
          <IconButton 
            onClick={() => handleSaveRole(null, newRoleName)}
            disabled={isAddDisabled}
            sx={{ height: '40px', width: '40px' }}
            aria-label="Додати роль"
          >
            <AddCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {isLoading ? (
            <Typography textAlign="center" color="text.secondary">
              Завантаження...
            </Typography>
          ) : roles.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Ролей немає
            </Typography>
          ) : (
            roles.map((role) => (
              <Box 
                key={role.id}
                sx={{ 
                  display: 'flex', gap: 1, alignItems: 'center', 
                  p: 2, border: '1px solid', borderColor: 'divider', 
                  borderRadius: 1, mb: 1 
                }}
              >
                <TextField 
                  value={role.name} 
                  onChange={(e) => handleSaveRole(role.id, e.target.value)}
                  size="small" 
                  sx={{ flex: 1 }} 
                />
                <IconButton 
                  onClick={() => handleDeleteRole(role.id)}
                  size="small" 
                  color="error"
                  aria-label="Видалити роль"
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

export default React.memo(RolesModal);

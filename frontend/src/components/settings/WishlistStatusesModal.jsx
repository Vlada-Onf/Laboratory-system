import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, 
  IconButton, Box, Typography, Button,DialogActions,DialogContentText} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';

const WishlistStatusesModal = ({ open, onClose }) => {
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');
  
  const [editingStatuses, setEditingStatuses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState(null);

  const { statuses, isLoading, fetchStatuses, addStatus, updateStatus, deleteStatus } = 
    useWishlistStatusesStore();

  useEffect(() => {
    if (open) {
      fetchStatuses();
      setRefreshKey(prev => prev + 1);
    }
  }, [open, fetchStatuses]);

  useEffect(() => {
    if (statuses.length > 0) {
      setEditingStatuses(statuses.map(status => ({
        ...status,
        localName: status.name,
        localDescription: status.description
      })));
    }
  }, [statuses, refreshKey]);

  const handleNameChange = useCallback((statusId, value) => {
    setEditingStatuses(prev => 
      prev.map(status => 
        status.id === statusId 
          ? { ...status, localName: value }
          : status
      )
    );
  }, []);

  const handleDescriptionChange = useCallback((statusId, value) => {
    setEditingStatuses(prev => 
      prev.map(status => 
        status.id === statusId 
          ? { ...status, localDescription: value }
          : status
      )
    );
  }, []);

  const handleOpenDeleteConfirm = useCallback((statusId, statusName) => {
    setStatusToDelete({ id: statusId, name: statusName });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (statusToDelete) {
      try {
        await deleteStatus(statusToDelete.id);
        setEditingStatuses(prev => prev.filter(s => s.id !== statusToDelete.id));
      } catch (error) {
        console.error('Помилка видалення статусу:', error);
        await fetchStatuses();
      }
    }
    setDeleteConfirmOpen(false);
    setStatusToDelete(null);
  }, [statusToDelete, deleteStatus, fetchStatuses]);

  const handleSaveAll = useCallback(async () => {
    setIsSaving(true);
    try {
      if (newStatusName.trim() && newStatusDescription.trim()) {
        await addStatus({ 
          name: newStatusName.trim(), 
          description: newStatusDescription.trim() 
        });
        setNewStatusName('');
        setNewStatusDescription('');
      }

      for (const status of editingStatuses) {
        if (status.localName !== status.name || status.localDescription !== status.description) {
          await updateStatus(status.id, { 
            id: status.id, 
            name: status.localName.trim(), 
            description: status.localDescription.trim() 
          });
        }
      }

      await fetchStatuses();
      
    } catch (error) {
      console.error('Помилка збереження:', error);
      await fetchStatuses();
    } finally {
      setIsSaving(false);
    }
  }, [newStatusName, newStatusDescription, editingStatuses, addStatus, updateStatus, fetchStatuses]);

  const hasChanges = editingStatuses.some(s => 
    s.localName !== s.name || s.localDescription !== s.description
  ) || (newStatusName.trim() && newStatusDescription.trim());

  const handleClose = useCallback(() => {
    setNewStatusName('');
    setNewStatusDescription('');
    setDeleteConfirmOpen(false);
    setStatusToDelete(null);
    onClose();
  }, [onClose]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Статуси списку бажаного
          <IconButton 
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Закрити"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end', mb: 3 }}>
            <TextField 
              label="Нова назва статусу"
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
              onClick={handleSaveAll}
              disabled={!newStatusName.trim() || !newStatusDescription.trim() || isSaving}
              sx={{ height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {isLoading ? (
              <Typography textAlign="center" color="text.secondary">
                Завантаження...
              </Typography>
            ) : editingStatuses.length === 0 ? (
              <Typography textAlign="center" color="text.secondary">
                Статусів немає
              </Typography>
            ) : (
              editingStatuses.map((status) => (
                <Box 
                  key={status.id}
                  sx={{ 
                    display: 'flex', gap: 1, alignItems: 'center', 
                    p: 2, border: '1px solid', borderColor: 'divider', 
                    borderRadius: 1, mb: 1 
                  }}
                >
                  <TextField 
                    value={status.localName} 
                    onChange={(e) => handleNameChange(status.id, e.target.value)}
                    size="small" 
                    sx={{ flex: 1 }} 
                  />
                  <TextField 
                    value={status.localDescription} 
                    onChange={(e) => handleDescriptionChange(status.id, e.target.value)}
                    size="small" 
                    sx={{ flex: 2 }} 
                  />
                  <IconButton 
                    onClick={() => handleOpenDeleteConfirm(status.id, status.localName)}
                    size="small" 
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>

          {hasChanges && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'right' }}>
              <Button
                onClick={handleSaveAll}
                variant="contained"
                disabled={isSaving}
                sx={{ 
                  background: 'linear-gradient(135deg, #08273b, #365468)',
                  '&:hover': { background: 'linear-gradient(135deg, #051926, #20314a)' }
                }}
              >
                {isSaving ? 'Зберігаємо...' : 'Зберегти всі зміни'}
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Підтвердити видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити статус 
            "<strong>{statusToDelete?.name}</strong>"?
            <br />
            Ця дія не може бути скасована.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Скасувати</Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={isSaving}
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(WishlistStatusesModal);

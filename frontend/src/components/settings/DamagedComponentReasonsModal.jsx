import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography, Button} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDamagedComponentReasonsStore } from '@store/useDamagedComponentReasonsStore';

const DamagedComponentReasonsModal = ({ open, onClose }) => {
  const [newReasonName, setNewReasonName] = useState('');
  const [newReasonDescription, setNewReasonDescription] = useState('');

  const [editingReasons, setEditingReasons] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reasonToDelete, setReasonToDelete] = useState(null);

  const { reasons, isLoading, fetchReasons, addReason, updateReason, deleteReason } = 
    useDamagedComponentReasonsStore();

  useEffect(() => {
    if (open) fetchReasons();
  }, [open, fetchReasons]);

  useEffect(() => {
    if (reasons.length > 0) {
      setEditingReasons(reasons.map(reason => ({
        ...reason,
        localName: reason.name,
        localDescription: reason.description
      })));
    }
  }, [reasons]);

  const handleNameChange = useCallback((reasonId, value) => {
    setEditingReasons(prev =>
      prev.map(reason =>
        reason.id === reasonId
          ? { ...reason, localName: value }
          : reason
      )
    );
  }, []);

  const handleDescriptionChange = useCallback((reasonId, value) => {
    setEditingReasons(prev =>
      prev.map(reason =>
        reason.id === reasonId
          ? { ...reason, localDescription: value }
          : reason
      )
    );
  }, []);

  const handleSaveAll = useCallback(async () => {
    setIsSaving(true);
    try {
      if (newReasonName.trim() && newReasonDescription.trim()) {
        await addReason({
          name: newReasonName.trim(),
          description: newReasonDescription.trim()
        });
        setNewReasonName('');
        setNewReasonDescription('');
      }

      for (const reason of editingReasons) {
        if (reason.localName !== reason.name || reason.localDescription !== reason.description) {
          await updateReason(reason.id, {
            id: reason.id,
            name: reason.localName.trim(),
            description: reason.localDescription.trim()
          });
        }
      }

      await fetchReasons();
    } catch (error) {
      console.error('Помилка збереження:', error);
    } finally {
      setIsSaving(false);
    }
  }, [newReasonName, newReasonDescription, editingReasons, addReason, updateReason, fetchReasons]);

  const handleOpenDeleteConfirm = useCallback((reasonId, reasonName) => {
    setReasonToDelete({ id: reasonId, name: reasonName });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (reasonToDelete) {
      try {
        await deleteReason(reasonToDelete.id);
        setEditingReasons(prev => prev.filter(reason => reason.id !== reasonToDelete.id));
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setReasonToDelete(null);
  }, [reasonToDelete, deleteReason]);

  const hasChanges = editingReasons.some(reason => 
      reason.localName !== reason.name || reason.localDescription !== reason.description
    ) || newReasonName.trim() || newReasonDescription.trim();

  const isAddDisabled = !newReasonName.trim() || !newReasonDescription.trim();

  return (
    <>
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
              onClick={handleSaveAll}
              disabled={isAddDisabled || isSaving}
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
            ) : editingReasons.length === 0 ? (
              <Typography textAlign="center" color="text.secondary">
                Причин немає
              </Typography>
            ) : (
              editingReasons.map((reason) => (
                <Box
                  key={reason.id}
                  sx={{
                    display: 'flex', gap: 1, alignItems: 'center',
                    p: 2, border: '1px solid', borderColor: 'divider',
                    borderRadius: 1, mb: 1
                  }}
                >
                  <TextField
                    value={reason.localName}
                    onChange={(e) => handleNameChange(reason.id, e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={reason.localDescription}
                    onChange={(e) => handleDescriptionChange(reason.id, e.target.value)}
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <IconButton
                    onClick={() => handleOpenDeleteConfirm(reason.id, reason.localName)}
                    size="small"
                    color="error"
                    aria-label="Видалити причину"
                  >
                    <DeleteIcon />
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Підтвердити видалення</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Ви впевнені, що хочете видалити причину
            <strong> "{reasonToDelete?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ця дія не може бути скасована.
          </Typography>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => setDeleteConfirmOpen(false)}
            size="small"
            aria-label="Скасувати"
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={handleConfirmDelete}
            color="error"
            size="small"
            aria-label="Видалити"
            disabled={isSaving}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
};

export default React.memo(DamagedComponentReasonsModal);

import React, { useState, useEffect, useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, IconButton, Box, Typography, Button,DialogActions,DialogContentText} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';

const NeedImportancesModal = ({ open, onClose }) => {
  const [newImportanceName, setNewImportanceName] = useState('');
  const [newImportanceLevel, setNewImportanceLevel] = useState(0);

  const [editingImportances, setEditingImportances] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [importanceToDelete, setImportanceToDelete] = useState(null);

  const { importances, isLoading, fetchImportances, addImportance, updateImportance, deleteImportance } = 
    useNeedImportancesStore();

  useEffect(() => {
    if (open) fetchImportances();
  }, [open, fetchImportances]);

  useEffect(() => {
    if (importances.length > 0) {
      setEditingImportances(importances.map(imp => ({
        ...imp,
        localName: imp.name,
        localLevel: imp.level
      })));
    }
  }, [importances]);

  const handleNameChange = useCallback((impId, value) => {
    setEditingImportances(prev =>
      prev.map(imp =>
        imp.id === impId
          ? { ...imp, localName: value }
          : imp
      )
    );
  }, []);

  const handleLevelChange = useCallback((impId, value) => {
    setEditingImportances(prev =>
      prev.map(imp =>
        imp.id === impId
          ? { ...imp, localLevel: value }
          : imp
      )
    );
  }, []);

  const handleSaveAll = useCallback(async () => {
  setIsSaving(true);
  try {
    if (newImportanceName.trim()) {
      const levelNum = parseInt(newImportanceLevel);
      if (!isNaN(levelNum) && levelNum >= 0) {
        await addImportance({
          name: newImportanceName.trim(),
          level: levelNum
        });
        setNewImportanceName('');
        setNewImportanceLevel(0);
      }
    }

    for (const imp of editingImportances) {
      if (imp.localName !== imp.name || imp.localLevel !== imp.level) {
        const levelNum = parseInt(imp.localLevel);
        if (!isNaN(levelNum) && levelNum >= 0) {
          await updateImportance(imp.id, {
            name: imp.localName.trim(),
            level: levelNum
          });
        }
      }
    }

  } catch (error) {
    console.error('Помилка збереження:', error);
  } finally {
    setIsSaving(false);
  }
}, [newImportanceName, newImportanceLevel, editingImportances, addImportance, updateImportance]);

  const handleOpenDeleteConfirm = useCallback((impId, impName) => {
    setImportanceToDelete({ id: impId, name: impName });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (importanceToDelete) {
      try {
        await deleteImportance(importanceToDelete.id);
        setEditingImportances(prev => prev.filter(imp => imp.id !== importanceToDelete.id));
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setImportanceToDelete(null);
  }, [importanceToDelete, deleteImportance]);

  const hasChanges = editingImportances.some(imp => 
    imp.localName !== imp.name || imp.localLevel !== imp.level
  ) || newImportanceName.trim();

  const isAddDisabled = !newImportanceName.trim();

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Пріоритети потреб
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="Закрити"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Назва рівня
              </Typography>
              <TextField
                value={newImportanceName}
                onChange={(e) => setNewImportanceName(e.target.value)}
                size="small"
                fullWidth
                placeholder="Введіть назву"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Рівень (число)
              </Typography>
              <TextField
                type="number"
                value={newImportanceLevel}
                onChange={(e) => setNewImportanceLevel(e.target.value)}
                size="small"
                fullWidth
                placeholder="0"
                inputProps={{ min: 0, step: 1 }}
              />
            </Box>

            <IconButton
              onClick={handleSaveAll}
              disabled={isAddDisabled || isSaving}
              sx={{ height: '40px', width: '40px', alignSelf: 'flex-end' }}
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
            ) : editingImportances.length === 0 ? (
              <Typography textAlign="center" color="text.secondary">
                Рівнів важливості немає
              </Typography>
            ) : (
              editingImportances.map((imp) => (
                <Box
                  key={imp.id}
                  sx={{
                    display: 'flex', gap: 2, alignItems: 'center',
                    p: 2, border: '1px solid', borderColor: 'divider',
                    borderRadius: 1, mb: 1
                  }}
                >
                  <TextField
                    value={imp.localName}
                    onChange={(e) => handleNameChange(imp.id, e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    placeholder="Назва"
                  />
                  <TextField
                    value={imp.localLevel}
                    type="number"
                    onChange={(e) => handleLevelChange(imp.id, e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    inputProps={{ min: 0, step: 1 }}
                    placeholder="0"
                  />
                  <IconButton
                    onClick={() => handleOpenDeleteConfirm(imp.id, imp.localName)}
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
            Ви впевнені, що хочете видалити рівень важливості
            "<strong>{importanceToDelete?.name}</strong>"?
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

export default React.memo(NeedImportancesModal);

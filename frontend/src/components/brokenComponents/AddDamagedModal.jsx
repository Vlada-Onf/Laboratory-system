import React, { useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Box, FormControl, Select, MenuItem
} from '@mui/material';
import { useDamagedComponentsStore } from '../../store/useDamagedComponentsStore';
import { useDamagedComponentReasonsStore } from '../../store/useDamagedComponentReasonsStore';
import { useDamagedForm } from '../../hooks/broken/useDamagedForm';

const AddDamagedModal = ({ open, onClose, component, lastDamagedRecord }) => {
  const { addDamagedComponent, updateDamagedComponent, fetchDamagedComponents } = useDamagedComponentsStore();
  const { reasons, fetchReasons } = useDamagedComponentReasonsStore();
  const isEditing = !!lastDamagedRecord;

  useEffect(() => {
    if (open) {
      fetchReasons();
    }
  }, [open, fetchReasons]);

  const { form, handleChange, handleReasonChange, resetForm, isValid } = useDamagedForm(
    isEditing ? lastDamagedRecord : {}
  );

  const handleCloseModal = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid){
      return;
    }

    try {
      if (isEditing && lastDamagedRecord?.id) {
        await updateDamagedComponent(
          lastDamagedRecord.id,
          component.id,
          form.reasonId,
          form.quantity
        );
      } else {
        await addDamagedComponent(
          component.id,
          form.reasonId,
          form.quantity
        );
      }

      await fetchDamagedComponents();
      handleCloseModal();
    } catch (error) {
      console.error('ERROR:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Редагувати зламані компоненти' : 'Додати зламані компоненти'}
          {component?.name && ` (${component.name})`}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Кількість зламаних
              </Typography>
              <TextField
                type="number"
                value={form.quantity || ''}
                onChange={handleChange('quantity')}
                fullWidth
                required
                inputProps={{ min: 1 }}
                autoFocus
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Причина
              </Typography>
              <FormControl fullWidth required>
                <Select
                  value={form.reasonId || ''}
                  onChange={handleReasonChange}
                >
                  {reasons.map((reason) => (
                    <MenuItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {isEditing && form.description && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Опис
                </Typography>
                <TextField
                  value={form.description || ''}
                  onChange={handleChange('description')}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal}>Скасувати</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
          >
            {isEditing ? 'Зберегти зміни' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDamagedModal;

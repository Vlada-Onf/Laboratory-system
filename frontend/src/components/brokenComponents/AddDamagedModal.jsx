import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Box
} from '@mui/material';
import { useDamagedComponentsStore } from '../../store/useDamagedComponentsStore';

const AddDamagedModal = ({ open, onClose, component, lastDamagedRecord }) => {
  const { addDamagedComponent, updateDamagedComponent, fetchDamagedComponents } = useDamagedComponentsStore();
  const isEditing = !!lastDamagedRecord;

  const defaultForm = useMemo(() => ({
    quantity: isEditing && lastDamagedRecord?.quantity?.toString() || '',
    description: isEditing && lastDamagedRecord?.description || '',
  }), [isEditing, lastDamagedRecord]);

  const [form, setForm] = useState(defaultForm);

  React.useEffect(() => {
    setForm(defaultForm);
  }, [defaultForm]);

  const handleCloseModal = () => {
    setForm(defaultForm);
    onClose();
  };

  const handleInputChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const HARDCODE_REASON_ID = "d1f539e7-c137-42e3-81d9-920b1fb8ecd7";

    if (!form.quantity?.trim() || Number(form.quantity) <= 0) {
      return;
    }

    try {
      if (isEditing && lastDamagedRecord?.id) {
        await updateDamagedComponent(
          lastDamagedRecord.id,
          component.id,
          HARDCODE_REASON_ID,
          form.quantity
        );
      } else {
        await addDamagedComponent(
          component.id,
          HARDCODE_REASON_ID,
          form.quantity
        );
      }

      await fetchDamagedComponents();
      handleCloseModal();
    } catch (error) {
      console.error('ERROR:', error);
    }
  };

  const isSubmitDisabled = !form.quantity?.trim();

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
                onChange={handleInputChange('quantity')}
                fullWidth
                required
                inputProps={{ min: 0 }}
                autoFocus
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal}>
            Скасувати
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitDisabled}
          >
            {isEditing ? 'Зберегти зміни' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDamagedModal;
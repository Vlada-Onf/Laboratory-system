import React, { useState, useCallback, useEffect } from 'react';
import {Box, TextField, Button, Stack, Typography, FormControl, Select, MenuItem, InputLabel} from '@mui/material';
import { useWishlistImportancesStore } from '@store/useWishlistImportancesStore';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';

const getInitialForm = (initialData) => ({
  name: initialData?.name || '',
  quantity: initialData?.quantity || 1,
  description: initialData?.description || '',
  importanceId: initialData?.importanceId || '',
  statusId: initialData?.statusId || '',
  completionReason: initialData?.completionReason || '',
});

const AddNeedForm = ({ initialData, onSubmit, onCancel }) => {
  const { importances, fetchImportances } = useWishlistImportancesStore();
  const { statuses, fetchStatuses } = useWishlistStatusesStore();
  const [form, setForm] = useState(() => getInitialForm(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchImportances();
    fetchStatuses();
  }, [fetchImportances, fetchStatuses]);

  useEffect(() => {
    setForm(getInitialForm(initialData));
  }, [initialData]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validate = () => {
    const newErrors = {};

     if (!form.name.trim()) {
      newErrors.name = 'Назва обов’язкова';
     }
    if (!form.importanceId) {
      newErrors.importanceId = 'Важливість обов’язкова';
    }
    if (!form.statusId) {
      newErrors.statusId = 'Статус обов’язковий';
    }
    if (form.quantity < 0) {
      newErrors.quantity = 'Кількість не може бути від’ємною';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: form.name.trim(),
      quantityNeeded: Number(form.quantity),
      description: form.description.trim(),
      importanceId: form.importanceId,
      statusId: form.statusId,
      completionReason: form.completionReason.trim(),
    };
    onSubmit(data);
  };

  const isEditing = !!initialData?.id;

  return (
    <Box component="form" id="add-need-form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2} mt={1}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Назва компонента *
          </Typography>
          <TextField
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Кількість *
          </Typography>
          <TextField
            type="number"
            value={form.quantity}
            onChange={handleChange('quantity')}
            error={!!errors.quantity}
            helperText={errors.quantity}
            inputProps={{ min: 0, step: 1 }}
            fullWidth
            required
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Опис
          </Typography>
          <TextField
            value={form.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
            fullWidth
          />
        </Box>


        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Важливість *
          </Typography>
          <FormControl fullWidth error={!!errors.importanceId} required>
            <InputLabel>Важливість</InputLabel>
            <Select
              value={form.importanceId}
              onChange={handleChange('importanceId')}
              label="Важливість"
            >
              {importances.map((imp) => (
                <MenuItem key={imp.id} value={imp.id}>{imp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Статус *
          </Typography>
          <FormControl fullWidth error={!!errors.statusId} required>
            <InputLabel>Статус</InputLabel>
            <Select
              value={form.statusId}
              onChange={handleChange('statusId')}
              label="Статус"
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Stack direction="row" spacing={1} mt={2}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: '#08273b',
              borderColor: '#08273b',
              '&:hover': {
                backgroundColor: '#ffe6dc',
                borderColor: '#08273b',
              },
            }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{
              background: 'linear-gradient(135deg, #08273b, #365468)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, #051926, #20314a)',
              },
            }}
          >
            {isEditing ? 'Зберегти зміни' : 'Створити потребу'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddNeedForm;

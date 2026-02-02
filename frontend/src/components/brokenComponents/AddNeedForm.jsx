import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';

const PRIORITIES = ['Низька', 'Середня', 'Висока'];

const AddNeedForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({
    quantity: 1,
    price: initialData.price || '',
    reason: '',
    description: initialData.description || '',
    priority: '',
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box
      component="form"
      id="add-need-form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={2} mt={1}>
        <TextField
          label="Компонент"
          value={initialData.name}
          disabled
        />

        <TextField
          label="Категорія"
          value={initialData.category || '—'}
          disabled
        />

        <TextField
          label="Кількість"
          type="number"
          value={form.quantity}
          onChange={handleChange('quantity')}
          inputProps={{ min: 1 }}
          required
        />

        <TextField
          label="Ціна (₴)"
          type="number"
          value={form.price}
          onChange={handleChange('price')}
        />

        <TextField
          label="Причина"
          value={form.reason}
          onChange={handleChange('reason')}
          multiline
          rows={2}
          required
        />

        <TextField
          label="Опис"
          value={form.description}
          onChange={handleChange('description')}
          multiline
          rows={2}
        />

        <TextField
          select
          label="Важливість"
          value={form.priority}
          onChange={handleChange('priority')}
          required
        >
          {PRIORITIES.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
};

export default AddNeedForm;

import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useCategoriesStore } from '../../store/useCategoriesStore';

const PRIORITIES = ['Низька', 'Середня', 'Висока'];

const AddNeedForm = ({ initialData, onSubmit }) => {
  const categories = useCategoriesStore(state => state.categories);
  const categoryOptions = React.useMemo(() =>
    categories.map(cat => ({ value: cat.id, label: cat.title })),
  [categories]
  );

  const [form, setForm] = useState({
    quantity: 1,
    price: initialData.price || '',
    reason: '',
    description: initialData.description || '',
    priority: '',
  });

  const handleChange = useCallback((field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      categoryId: initialData.categoryId,
    });
  };

  return (
    <Box component="form" id="add-need-form" onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <TextField
          label="Компонент"
          value={initialData.name}
          disabled
        />

        <FormControl fullWidth disabled>
          <InputLabel>Категорія</InputLabel>
          <Select
            value={initialData.categoryId || ''}
            label="Категорія"
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Решта полів без змін */}
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

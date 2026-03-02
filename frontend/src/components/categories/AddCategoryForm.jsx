import React, { useCallback } from 'react';
import { Box, TextField, Button, Stack, Typography, FormControl } from '@mui/material';
import ColorPicker from './ColorPicker';
import { useCategoryForm } from '../../hooks/categories/useCategoryForm';

const AddCategoryForm = ({ initialData, onSubmit, onCancel }) => {
  const { form, errors, handleChange, handleColorChange, validate, isValid } = useCategoryForm(initialData);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      photo: form.photo,
    });
  }, [form, validate, onSubmit]);

  return (
    <Box component="form" id="add-category-form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2} mt={1}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Назва</Typography>
          <TextField
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth required
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Опис</Typography>
          <TextField
            value={form.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            multiline rows={3} fullWidth required
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Фото категорії</Typography>
          <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', py: 1.5, mb: 1 }}>
            {form.photo ? form.photo.name : 'Вибрати фото'}
            <input type="file" accept="image/*" hidden onChange={handleChange('photo')} />
          </Button>
          {form.photo && (
            <Box sx={{ mt: 1 }}>
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 4 }}
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Колір</Typography>
          <FormControl error={!!errors.color}>
            <ColorPicker value={form.color} onChange={handleColorChange} />
          </FormControl>
        </Box>

        <Stack direction="row" spacing={1} mt={2}>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Скасувати
          </Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            {initialData ? 'Зберегти зміни' : 'Додати категорію'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddCategoryForm;

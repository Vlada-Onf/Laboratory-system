import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material';
import ColorPicker from './ColorPicker';

const getInitialForm = (initialData) => ({
  name: initialData?.name || initialData?.title || '',
  description: initialData?.description || '',
  photo: null,
  color: initialData?.color || '#08273b',
});

const AddCategoryForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => getInitialForm(initialData));
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setForm(getInitialForm(initialData));
  }, [initialData]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleColorChange = (color) => {
    setForm((prev) => ({ ...prev, color }));
    if (errors.color) {
      setErrors((prev) => ({ ...prev, color: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Назва обов’язкова';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Опис обов’язковий';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()){
      return;
    }

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      photo: form.photo,
    };
    console.log('formData', data);
    onSubmit(data);
  };

  return (
    <Box component="form" id="add-category-form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2} mt={1}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Назва
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
            Опис
          </Typography>
          <TextField
            value={form.description}
            onChange={handleChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            fullWidth
            required
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Фото категорії
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ textTransform: 'none', py: 1.5, mb: 1 }}
          >
            {form.photo ? form.photo.name : 'Вибрати фото'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleChange('photo')}
            />
          </Button>
          {form.photo && (
            <Box sx={{ mt: 1 }}>
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Колір
          </Typography>
          <FormControl error={!!errors.color}>
            <ColorPicker value={form.color} onChange={handleColorChange} />
            {errors.color && <FormHelperText>{errors.color}</FormHelperText>}
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
            sx={{
              background: 'linear-gradient(135deg, #08273b, #365468)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, #051926, #20314a)',
              },
            }}
          >
            {initialData ? 'Зберегти зміни' : 'Додати категорію'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddCategoryForm;

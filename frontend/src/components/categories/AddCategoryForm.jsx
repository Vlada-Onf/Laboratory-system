import React, { useState } from 'react';
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
  name: initialData?.title || '',
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

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

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
    <Box
      component="form"
      id="add-category-form"
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
    >
      <Stack spacing={2} mt={1}>
        <TextField
          label="Назва"
          value={form.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          required
        />

        <TextField
          label="Опис"
          value={form.description}
          onChange={handleChange('description')}
          error={!!errors.description}
          helperText={errors.description}
          multiline
          rows={3}
          required
        />

        <FormControl error={!!errors.photo}>
          <Typography variant="body2" gutterBottom>
            Фото
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              textTransform: 'none',
              color: '#08273b',
              borderColor: '#08273b',
              '&:hover': {
                backgroundColor: '#ffe6dc',
                borderColor: '#08273b',
              },
            }}
          >
            {form.photo ? form.photo.name : 'Вибрати фото'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleChange('photo')}
            />
          </Button>
          {errors.photo && (
            <FormHelperText>{errors.photo}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.color}>
          <Typography variant="body2" gutterBottom>
            Колір
          </Typography>
          <ColorPicker value={form.color} onChange={handleColorChange} />
          {errors.color && (
            <FormHelperText>{errors.color}</FormHelperText>
          )}
        </FormControl>

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

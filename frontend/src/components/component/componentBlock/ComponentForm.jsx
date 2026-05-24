import React, { useState } from 'react';
import { Box, FormControl, Select, MenuItem, TextField, Typography, Button, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PhotoUpload from './PhotoUpload';
import TagsInput from './TagsInput';
import { useComponentsStore } from '@/store/useComponentsStore';

const ComponentForm = ({
  form,
  categoryOptions,
  selectedFile,
  tags,
  onInputChange,
  onCategoryChange,
  isEditing,
  ...tagsProps
}) => {
  const autofillComponentData = useComponentsStore((state) => state.autofillComponentData);
  const isAiLoading = useComponentsStore((state) => state.isLoading);

  const [aiConfidence, setAiConfidence] = useState(null);

  const fields = [
    {
      field: 'name',
      label: 'Назва *',
      required: true,
      type: 'text',
      placeholder: 'Обов’язково введіть назву компонента'
    },
    {
      field: 'description',
      label: 'Опис',
      multiline: true,
      rows: 4,
      placeholder: 'Скористайтеся Інтелектуальним автозаповненням або введіть опис вручну'
    },
    {
      field: 'price',
      label: 'Ціна (₴)',
      type: 'number',
      placeholder: '0'
    },
    {
      field: 'quantity',
      label: 'Кількість',
      type: 'number',
      placeholder: '0'
    },
    {
      field: 'documentationLink',
      label: 'Посилання на документацію',
      placeholder: 'Вставте посилання'
    },
    {
      field: 'supplierLink',
      label: 'Посилання на магазин',
      placeholder: 'Вставте посилання'
    }
  ];

  const handleAiAutofill = async () => {
    if (!form.name?.trim()) {
      alert('Будь ласка, введіть назву компонента, щоб AI міг вам допомгти!');
      return;
    }

    try {
      const payload = {
        name: form.name,
        supplierLink: form.supplierLink || '',
        existingDescription: form.description || ''
      };

      const data = await autofillComponentData(payload);

      if (data) {
        if (data.description) {
          onInputChange('description')({ target: { value: data.description } });
        }

        if (data.suggestedCategoryId) {
          const categoryExists = categoryOptions.some(opt => opt.value === data.suggestedCategoryId);
          if (categoryExists) {
            onCategoryChange({ target: { value: data.suggestedCategoryId } });
          }
        }

        if (data.tagIds && data.tagIds.length > 0 && tagsProps.onTagsChange) {
          tagsProps.onTagsChange(data.tagIds);
        }

        if (data.confidence !== undefined) {
          setAiConfidence(Math.round(data.confidence * 100));
        }
      }
    } catch (error) {
      console.error('Помилка генерації AI:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

      <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Інтелектуальне автозаповнення</Typography>
            <Typography variant="caption" color="text.secondary">
              Введіть назву та/або лінк на магазин, а ШІ підбере категорію та опис
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={isAiLoading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
          onClick={handleAiAutofill}
          disabled={isAiLoading || !form.name?.trim()}
          size="small"
          sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          {isAiLoading ? 'Генерація...' : 'Заповнити через AI'}
        </Button>
      </Box>

      {aiConfidence !== null && (
        <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, px: 1 }}>
          ✨ Поля успішно оновлено. Впевненість ШІ: {aiConfidence}%
        </Typography>
      )}

      <PhotoUpload
        selectedFile={selectedFile}
        photoName={form.photoName}
        onFileChange={onInputChange('photo')}
        isOptional={isEditing}
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Категорія *
        </Typography>
        <FormControl fullWidth required>
          <Select
            value={form.categoryId || ''}
            onChange={onCategoryChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Оберіть категорію</MenuItem>
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {fields.map(({ field, label, required = false, type = 'text', multiline, rows, placeholder }) => (
        <Box key={field}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <TextField
            value={form[field] || ''}
            onChange={onInputChange(field)}
            fullWidth
            required={required}
            type={type}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
          />
        </Box>
      ))}

      <TagsInput
        tags={tags}
        tagInput={form.tagInput}
        onTagInputChange={onInputChange('tagInput')}
        {...tagsProps}
      />
    </Box>
  );
};

export default ComponentForm;
import { Box, FormControl, Select, MenuItem, TextField, Typography } from '@mui/material';
import PhotoUpload from './PhotoUpload';
import TagsInput from './TagsInput';

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
  const fields = [
    {
      field: 'name',
      label: 'Назва *',
      required: true,
      type: 'text'
    },
    {
      field: 'description',
      label: 'Опис',
      multiline: true,
      rows: 3
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

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
          >
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

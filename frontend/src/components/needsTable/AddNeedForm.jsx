import { useCallback } from 'react';
import {Box, TextField, MenuItem, Stack, FormControl, InputLabel, Select,} from '@mui/material';

import { useNeedForm } from '../../hooks/needs/useNeedForm';
import { useNeedOptions } from '../../hooks/needs/useNeedOptions';

const AddNeedForm = ({ initialData, onSubmit }) => {
  const { form, handleChange, getPayload } = useNeedForm(initialData);
  const { categoryOptions, importanceOptions, statusOptions } = useNeedOptions();
  
  const componentName = initialData.name || initialData.componentName || '—';

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(getPayload());
  }, [getPayload, onSubmit]);

  return (
    <Box component="form" id="add-need-form" onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <TextField label="Компонент" value={componentName} disabled fullWidth />

        <FormControl fullWidth disabled>
          <InputLabel>Категорія</InputLabel>
          <Select value={initialData.categoryId || ''} label="Категорія" displayEmpty>
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Кількість"
          type="number"
          value={form.quantity}
          onChange={handleChange('quantity')}
          inputProps={{ min: 1 }}
          required
        />

        <TextField
          fullWidth
          label="Опис"
          value={form.description}
          onChange={handleChange('description')}
          multiline rows={4}
          placeholder="Введіть повний опис потреби..."
          required
        />

        <TextField
          fullWidth
          label="Причина"
          value={form.completionReason}
          onChange={handleChange('completionReason')}
          multiline rows={3}
          placeholder="Причина потреби..."
        />

        <FormControl fullWidth required>
          <InputLabel>Важливість</InputLabel>
          <Select value={form.importanceId} label="Важливість" onChange={handleChange('importanceId')}>
            {importanceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Статус</InputLabel>
          <Select value={form.statusId} label="Статус" onChange={handleChange('statusId')}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AddNeedForm;

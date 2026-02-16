import React, { useState, useCallback } from 'react';
import { Box, TextField, Stack } from '@mui/material';

const AddDamagedForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({
    quantity: 1,
  });

  const handleChange = useCallback((field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" id="add-damaged-form" onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <TextField label="Компонент" value={initialData.name} disabled fullWidth />
        <TextField
          label="Кількість"
          type="number"
          value={form.quantity}
          onChange={handleChange('quantity')}
          inputProps={{ min: 1 }}
          required
          fullWidth
        />
      </Stack>
    </Box>
  );
};

export default AddDamagedForm;

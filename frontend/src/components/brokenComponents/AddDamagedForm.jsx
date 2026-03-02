import React, { useEffect } from 'react';
import { Box, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDamagedComponentReasonsStore } from '../../store/useDamagedComponentReasonsStore';
import { useDamagedForm } from '../../hooks/forms/useDamagedForm';

const AddDamagedForm = ({ initialData = {}, onSubmit }) => {
  const { reasons, fetchReasons } = useDamagedComponentReasonsStore();
  const { form, handleChange, handleReasonChange } = useDamagedForm(initialData);

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" id="add-damaged-form" onSubmit={handleSubmit}>
      <Stack spacing={2} mt={1}>
        <TextField label="Компонент" value={initialData.name || ''} disabled fullWidth/>

        <TextField
          label="Кількість"
          type="number"
          value={form.quantity}
          onChange={handleChange('quantity')}
          slotProps={{input: {min: 1, step: '1'}}}
          required 
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>Причина</InputLabel>
          <Select
            value={form.reasonId}
            label="Причина"
            onChange={handleReasonChange}
          >
            {reasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id}>
                {reason.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AddDamagedForm;

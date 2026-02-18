import React from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const LinkForm = ({ 
  newLinkTitle, 
  newLinkUrl, 
  onTitleChange, 
  onUrlChange, 
  onAdd,
  disabled 
}) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
    <TextField
      label="Назва"
      value={newLinkTitle}
      onChange={onTitleChange}
      size="small"
      fullWidth
    />
    <TextField
      label="Посилання"
      value={newLinkUrl}
      onChange={onUrlChange}
      size="small"
      fullWidth
    />
    <IconButton 
      onClick={onAdd} 
      disabled={disabled}
      sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
    >
      <AddCircleIcon />
    </IconButton>
  </Box>
);

export default React.memo(LinkForm);

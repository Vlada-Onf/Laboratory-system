import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LinkList = ({ 
  usefulLinks = [], 
  onUpdate, 
  onDelete 
}) => (
  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
    {usefulLinks.map((link) => (
      <Box 
        key={link.id} 
        sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          p: 1, 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          mb: 1 
        }}
      >
        <TextField
          value={link.title}
          onChange={(e) => onUpdate(link.id, e.target.value, link.url)}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          value={link.url}
          onChange={(e) => onUpdate(link.id, link.title, e.target.value)}
          size="small"
          sx={{ flex: 2 }}
        />
        <IconButton onClick={() => onDelete(link.id)} size="small" color="error">
          <CloseIcon />
        </IconButton>
      </Box>
    ))}
  </Box>
);

export default React.memo(LinkList);

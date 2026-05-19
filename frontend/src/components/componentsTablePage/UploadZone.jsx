import React from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadZone = ({ onFileChange }) => {
  return (
    <Box
      component="label"
      sx={{
        flex: 1,
        border: '2px dashed #e0e0e0',
        borderRadius: 4,
        p: 6,
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { borderColor: '#6a11cb' }
      }}
    >
      <input type="file" hidden accept="image/*" onChange={onFileChange} />
      <CloudUploadIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
      <Typography variant="h5" mb={1}>Завантажте фото компонентів</Typography>
      <Typography variant="body1" color="text.secondary">
        ШІ розпізнає всі об'єкти на фото, а система додасть їх у таблицю
      </Typography>
    </Box>
  );
};

export default UploadZone;
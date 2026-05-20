import React from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadZone = ({ onFileChange }) => {
  const allowedFormats = "image/*,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

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
      <input
        type="file"
        hidden
        accept={allowedFormats}
        onChange={onFileChange}
      />
      <CloudUploadIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
      <Typography variant="h5" mb={1}>
        Завантажте фото або таблицю
      </Typography>
      <Typography variant="body1" color="text.secondary">
        ШІ розпізнає об'єкти на фото чи дані з Excel/CSV та додасть їх у систему
      </Typography>
    </Box>
  );
};

export default UploadZone;
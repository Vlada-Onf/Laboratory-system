import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const PreviewSidebar = ({ preview, isAnyLoading, isSaving, isCreatingCategory }) => {
  const getLoadingText = () => {
    if (isSaving) return "ЗБЕРЕЖЕННЯ ...";
    if (isCreatingCategory) return "БУДЬ ЛАСКА ЗАЧЕКАЙТЕ, СТВОРЕННЯ КАТЕГОРІЇ...";
    return "АНАЛІЗУЄМО ...";
  };

  const isFileObject = preview instanceof File;
  const isImage = isFileObject ? preview.type.startsWith('image/') : typeof preview === 'string' && !preview.endsWith('.svg');

  return (
    <Box sx={{ width: { xs: '100%', md: '350px', lg: '400px' }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{
        position: 'relative', width: '100%', height: { xs: 200, md: '100%' }, maxHeight: { md: 'calc(100vh - 200px)' },
        borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #e0e0e0', bgcolor: '#fafafa', p: 2
      }}>

        {isImage ? (
          <img src={isFileObject ? URL.createObjectURL(preview) : preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : isFileObject ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <InsertDriveFileIcon sx={{ fontSize: 80, color: '#107c41', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="600" sx={{ wordBreak: 'break-all', px: 2 }}>
              {preview.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(preview.size / 1024).toFixed(1)} KB • Таблиця
            </Typography>
          </Box>
        ) : (
          <img src={preview} alt="Placeholder" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}

        {isAnyLoading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(106, 17, 203, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 10 }}>
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center', px: 2 }}>
              {getLoadingText()}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PreviewSidebar;
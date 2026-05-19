import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const PreviewSidebar = ({ preview, isAnyLoading, isSaving, isCreatingCategory }) => {
  const getLoadingText = () => {
    if (isSaving) return "ЗБЕРЕЖЕННЯ ...";
    if (isCreatingCategory) return "БУДЬ ЛАСКА ЗАЧЕКАЙТЕ, СТВОРЕННЯ КАТЕГОРІЇ...";
    return "АНАЛІЗУЄМО ...";
  };

  return (
    <Box sx={{
      width: { xs: '100%', md: '350px', lg: '400px' },
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 200, md: '100%' },
        maxHeight: { md: 'calc(100vh - 200px)' },
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e0e0e0',
        bgcolor: '#fafafa'
      }}>
        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />

        {isAnyLoading && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: 'rgba(106, 17, 203, 0.4)', backdropFilter: 'blur(3px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white',
            zIndex: 10
          }}>
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
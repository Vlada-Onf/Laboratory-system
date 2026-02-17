import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const SchematicHeader = ({ schematic, currentComponent}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
const navigate = useNavigate();
  return (
    <Box sx={{ mb: 4 }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,

          '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },

          '&:active, &:focus': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
          },
        }}
      >
        ← Назад до {currentComponent?.name || 'компонента'}
      </Button>

      <Typography variant="h3" gutterBottom component="h1">
        {schematic.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
        {schematic.description}
      </Typography>
    </Box>
  );
};

export default React.memo(SchematicHeader);

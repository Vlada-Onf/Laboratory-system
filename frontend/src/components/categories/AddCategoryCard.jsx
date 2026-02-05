import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '../../context/useTheme';

const AddCategoryCard = ({ onClick }) => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b';

  return (
    <Card
      sx={{
        width: 300,
        height: 240,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed #999',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box textAlign="center">
        <IconButton sx={{ color: textColor }}>
          <AddIcon fontSize="large" sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h6" sx={{ color: textColor }}>
          Додати категорію
        </Typography>
      </Box>
    </Card>
  );
};

export default AddCategoryCard;

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '../../context/useTheme';
import AddCategoryModal from './AddCategoryModal';

const AddCategoryCard = ({ onAdd }) => {
  const { isDarkMode } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b';

  const handleAdd = (categoryData) => {
    console.log('handleAdd categoryData', categoryData);
    const uniqueId = Date.now() + Math.random();
    onAdd({
      ...categoryData,
      id: uniqueId,
    });
  };

  return (
    <>
      <Card
        sx={{
          width: 300,
          height: 240,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
        onClick={() => setOpenModal(true)}
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

      <AddCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAdd}
      />
    </>
  );
};

export default AddCategoryCard;

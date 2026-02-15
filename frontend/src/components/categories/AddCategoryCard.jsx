import React, { useState } from 'react';
import { Card, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '../../context/useTheme';
import AddCategoryModal from './AddCategoryModal';
import { useCategoriesStore } from '../../store/useCategoriesStore';

const AddCategoryCard = () => {
  const { addCategory } = useCategoriesStore();
  const { isDarkMode } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b';

  const handleAdd = async (categoryData) => {
    
    try {
      await addCategory(categoryData);
      
      setOpenModal(false);
    } catch (error) {
      console.error('Помилка створення:', error);
    }
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

import React, {useCallback}from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import CategoryCard from './CategoryCard';
import AddCategoryCard from './AddCategoryCard';
import { useNavigate } from 'react-router-dom';

const CategoriesGrid = () => {
  const navigate = useNavigate();
  const {
    categories,
    isLoading,
    updateCategory,
    deleteCategory
  } = useCategoriesStore();

  const handleCategoryClick = useCallback((categoryId) => {
    if (categoryId) {
      navigate(`/front-components?categoryId=${categoryId}`);
    } else {
      navigate('/front-components');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Завантажуємо категорії...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      
      <Grid container spacing={3} justifyContent="center">
        {categories.length > 0 && categories.map((cat) => (
          <Grid item key={cat.id} xs={12} sm={6} md={4}>
            <CategoryCard
              title={cat.name}
              description={cat.description}
              image={cat.photoUrl}
              color={cat.cardColor}
              id={cat.id}
              onEditCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onCategoryClick={handleCategoryClick}
            />
          </Grid>
        ))}
        
        <Grid item xs={12} sm={6} md={4}>
          <AddCategoryCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoriesGrid;

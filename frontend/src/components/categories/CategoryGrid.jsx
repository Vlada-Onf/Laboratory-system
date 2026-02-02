import React from 'react';
import { Grid } from '@mui/material';
import CategoryCard from './CategoryCard';
import AddCategoryCard from './AddCategoryCard';

const CategoriesGrid = ({ categories, onAdd }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {categories.map((cat) => (
        <Grid item key={cat.id} xs={12} sm={6} md={4}>
          <CategoryCard
            title={cat.title}
            description={cat.description}
            image={cat.image}
            color={cat.color}
          />
        </Grid>
      ))}

      <Grid item xs={12} sm={6} md={4}>
        <AddCategoryCard onClick={onAdd} />
      </Grid>
    </Grid>
  );
};

export default CategoriesGrid;

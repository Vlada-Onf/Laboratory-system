import React from 'react';
import { Container } from '@mui/material';
import CategoriesGrid from '../../components/categories/CategoryGrid';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useCategoriesStore } from '../../store/useCategoriesStore';

const Categories = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategoriesStore();

  return (
    <PageWrapper>
      <Container
        maxWidth="xl"
        sx={{
          height: '100%',
          overflowY: 'auto',
          py: 2,
        }}
      >
        <CategoriesGrid
          categories={categories}
          onAdd={addCategory}
          onEditCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      </Container>
    </PageWrapper>
  );
};

export default Categories;

import React, { useState } from 'react';
import { Container } from '@mui/material';
import CategoriesGrid from '../../components/categories/CategoryGrid';
import PageWrapper from '../../components/layout/PaperWrapper';

const mockCategories = [
  { id: 1, title: 'Електроніка', description: 'Мікроконтролери, плати, модулі живлення', image: 'https://osvita.ua/doc/images/news/628/62871/Electronics_e.PNG', color: '#841a1c' },
  { id: 2, title: 'Оптика', description: 'Камери, лінзи, сенсори', image: 'https://cdn.27.ua/sc--media--prod/default/fe/de/57/fede57f2-2e63-4223-b1ce-b7cc5886a5cb.jpg', color: '#08273b' },
  { id: 3, title: 'Механіка', description: 'Корпуси, кріплення, рухомі частини', image: 'https://mmi.kpi.ua/images/M_images/mech.png', color: '#841a1c' },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleEditCategory = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

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
          onAdd={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </Container>
    </PageWrapper>
  );
};

export default Categories;

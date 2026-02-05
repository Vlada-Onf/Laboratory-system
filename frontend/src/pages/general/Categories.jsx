import React from 'react';
import { Container } from '@mui/material';
import CategoriesGrid from '../../components/categories/CategoryGrid';
import PageWrapper from '../../components/layout/PaperWrapper';

const mockCategories = [
  { id: 1, title: 'Електроніка', description: 'Мікроконтролери, плати, модулі живлення', image: 'https://osvita.ua/doc/images/news/628/62871/Electronics_e.PNG', color: '#841a1c' },
  { id: 2, title: 'Оптика', description: 'Камери, лінзи, сенсори', image: 'https://cdn.27.ua/sc--media--prod/default/fe/de/57/fede57f2-2e63-4223-b1ce-b7cc5886a5cb.jpg', color: '#08273b' },
  { id: 3, title: 'Механіка', description: 'Корпуси, кріплення, рухомі частини', image: 'https://mmi.kpi.ua/images/M_images/mech.png', color: '#841a1c' },
];

const Categories = () => {
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
        <CategoriesGrid categories={mockCategories} onAdd={() => console.log('Add category')} />
      </Container>
    </PageWrapper>
  );
};

export default Categories;

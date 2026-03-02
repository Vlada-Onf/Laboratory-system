import { useEffect } from 'react';
import { Container } from '@mui/material';
import CategoriesGrid from '../../components/categories/CategoryGrid';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useCategoriesStore } from '../../store/useCategoriesStore';

const Categories = () => {
  const {
    isLoading,
    fetchCategories,
  } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, []);


  if (isLoading) {
    return (
      <PageWrapper>
        <Container maxWidth="xl" sx={{ p: 4, textAlign: 'center' }}>
          <h2>Завантаження...</h2>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container maxWidth="xl" sx={{ height: '100%', overflowY: 'auto', py: 2 }}>
        <CategoriesGrid />
      </Container>
    </PageWrapper>
  );
};

export default Categories;

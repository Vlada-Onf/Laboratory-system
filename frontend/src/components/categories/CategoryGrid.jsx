import React, { useCallback } from 'react';
import { Grid, Box} from '@mui/material';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import CategoryCard from './CategoryCard';
import AddCategoryCard from './AddCategoryCard';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const CategoriesGrid = () => {
  const navigate = useNavigate();
  const {
    categories,
    updateCategory,
    deleteCategory
  } = useCategoriesStore();

  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId) roles.push(user.roleId);
    if (user?.roles && Array.isArray(user.roles)) roles.push(...user.roles);
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);

  const handleCategoryClick = useCallback((categoryId) => {
    if (categoryId) {
      navigate(`/front-components?categoryId=${categoryId}`);
    } else {
      navigate('/front-components');
    }
  }, [navigate]);

  const showAddCategoryCard = !isLabRole;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {categories.length > 0 && categories.map((cat) => (
          <Grid item key={cat.id} xs={12} sm={6} md={4}>
            <CategoryCard
              name={cat.name}
              description={cat.description}
              cardColor={cat.cardColor}
              id={cat.id}
              image={cat.image}
              onEditCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onCategoryClick={handleCategoryClick}
              isLabRole={isLabRole}
            />
          </Grid>
        ))}
        {showAddCategoryCard && (
          <Grid item xs={12} sm={6} md={4}> <AddCategoryCard /></Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoriesGrid;

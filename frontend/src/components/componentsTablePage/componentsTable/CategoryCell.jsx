import { Typography, CircularProgress } from '@mui/material';

const CategoryCell = ({
  categoryId,
  categories,
  categoriesLoading,
  categoriesLoaded
}) => {
  if (!categoriesLoaded || categoriesLoading) {
    return <CircularProgress size={16} />;
  }

  const categoryName = categories?.find(c => c.id === categoryId)?.name || '—';

  return <Typography variant="body2">{categoryName}</Typography>;
};

CategoryCell.displayName = 'CategoryCell';
export default CategoryCell;

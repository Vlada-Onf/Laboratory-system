import React from 'react';
import { Box, Typography } from '@mui/material';
import TagsList from './TagsList';
import { useCategoriesStore } from '../../../store/useCategoriesStore';

const ComponentInfo = function(props) {
  const { description, price, categoryId, tags, category } = props;
  const categories = useCategoriesStore(state => state.categories);
  const categoryName = categories.find(cat => cat.id === categoryId)?.title || category || '—';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      <Typography variant="body1" fontSize={18}><strong>Опис:</strong> {description || '—'}</Typography>
      <Typography variant="body1" fontSize={18}><strong>Ціна:</strong> {price ? `${price} ₴` : '—'}</Typography>
      <Typography variant="body1" fontSize={18}>
        <strong>Категорія:</strong> {categoryName}
      </Typography>
      <Box>
        <Typography variant="body1" fontSize={18} sx={{ mb: 0.5 }}><strong>Теги:</strong></Typography>
        <TagsList tags={tags} />
      </Box>
    </Box>
  );
};

export default ComponentInfo;

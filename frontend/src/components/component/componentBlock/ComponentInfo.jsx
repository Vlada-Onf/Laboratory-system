import React from 'react';
import { Box, Typography } from '@mui/material';
import TagsList from './TagsList';
import { useCategoriesStore } from '@store/useCategoriesStore';

const ComponentInfo = function(props) {
  const { description, price, categoryId, tags, category } = props;
  const categories = useCategoriesStore(state => state.categories);
  const categoryName = categories.find(cat => cat.id === categoryId)?.name || category || '—';

  const normalizedTags = React.useMemo(() => {
    if (!tags){
      return [];
    }
    if (Array.isArray(tags)){
      return tags;
    }
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [];
  }, [tags]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      <Typography variant="body1" fontSize={18}>
        <strong>Опис:</strong> {description || '—'}
      </Typography>
      <Typography variant="body1" fontSize={18}>
        <strong>Ціна:</strong> {price ? `${price} ₴` : '—'}
      </Typography>
      <Typography variant="body1" fontSize={18}>
        <strong>Категорія:</strong> {categoryName}
      </Typography>
      <Box>
        <Typography variant="body1" fontSize={18} sx={{ mb: 0.5 }}>
          <strong>Теги:</strong>
        </Typography>
        <TagsList tags={normalizedTags} />
      </Box>
    </Box>
  );
};

export default ComponentInfo;

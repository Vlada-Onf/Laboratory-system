import { Box, Chip, Typography } from '@mui/material';

const EntityChips = ({ record, entityTypes, actions, entityName }) => {
  const entityType = entityTypes.find(et => et.id === record.entityTypeId);

  const typeColors = {
    'Компоненти': 'primary',
    'Схеми': 'error',
    'Дії': 'secondary',
    'Категорії': 'success',
    'Вішліст': 'warning',
    'Потреби': 'info'
  };

  const getEntityTypeChip = () => (
    <Chip
      label={entityType?.name || record.entityTypeName || 'Невідомо'}
      size="small"
      color={typeColors[entityType?.name] || 'default'}
      variant="filled"
      sx={{ mr: 1 }}
    />
  );

  const getActionChip = () => {
    const action = actions.find(a => a.id === record.actionId);
    const name = action?.name || record.actionName || 'Дія';

    return <Chip label={name} size="small" variant="outlined"  sx={{ ml: 'auto' }} />;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
      {getEntityTypeChip()}
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        "{entityName}"
      </Typography>
      {getActionChip()}
    </Box>
  );
};

export default EntityChips;
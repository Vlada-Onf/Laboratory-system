import React from 'react';
import { Box, Typography, Chip, Avatar, Card, CardContent, Divider } from '@mui/material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ColorSwatch from './ColorSwatch';
import ImagePreview from './ImagePreview';
import LinksRow from '../component/linksBlock/LinksRow';
import TagsCell from '../componentsTablePage/componentsTable/TagsCell';

const HistoryItem = ({ record }) => {
  const getEntityTypeChip = () => {
    const entityTypes = {
      1: { name: 'Категорії', color: 'success' },
      2: { name: 'Вішліст', color: 'warning' },
      3: { name: 'Потреби', color: 'info' },
      4: { name: 'Компоненти', color: 'primary' },
      5: { name: 'Схеми', color: 'error' },
    };

    const typeInfo = entityTypes[record.entityTypeId] ||
                     { name: record.entityTypeName || 'Невідомо', color: 'default' };

    return (
      <Chip
        label={typeInfo.name}
        size="small"
        color={typeInfo.color}
        variant="filled"
        sx={{ mr: 1 }}
      />
    );
  };

  const parseLinks = (linksData) => {
    try {
      return typeof linksData === 'string' ? JSON.parse(linksData) : linksData;
    } catch {
      return {};
    }
  };

  const formatLinks = (linksData) => {
    const links = parseLinks(linksData);
    const linkParts = [];

    if (Array.isArray(links.links)) {
      return links.links.length > 0 ? links.links : null;
    }

    if (links.docLink){
      linkParts.push(links.docLink);
    }

    if (links.buyLink){
      linkParts.push(links.buyLink);
    }

    if (links.otherLinks?.length > 0){
      linkParts.push(...links.otherLinks);
    }

    return linkParts.length > 0 ? linkParts : null;
  };

  const getActionChip = () => {
    return (
      <Chip
        label={record.actionName}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatChangeDescription = () => {
    if (record.actionName === 'Створено') {
      return `створено ${record.entityTypeName.toLowerCase()}`;
    }
    if (record.actionName === 'Видалено') {
      return `видалено ${record.entityTypeName.toLowerCase()}`;
    }

if (record.fieldName === 'теги' || record.fieldName?.includes('тег')) {
  const parseTags = (tagsData) => {
    try {
      if (!tagsData){
        return [];
      }

      if (typeof tagsData === 'string') {
        return JSON.parse(tagsData);
      }

      return Array.isArray(tagsData) ? tagsData : [];
    } catch {
      return typeof tagsData === 'string' ? tagsData.split(',').map(t => t.trim()).filter(Boolean) : [];
    }
  };

  const oldTags = parseTags(record.oldValue);
  const newTags = parseTags(record.newValue);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="body2" fontWeight={500}>змінено теги</Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          {oldTags?.length > 0 ? (
            <TagsCell value={oldTags} />
          ) : (
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>
          )}
        </Box>
        <TrendingFlatIcon
          sx={{
            fontSize: 20,
            color: 'text.secondary',
            transform: 'translateY(2px)',
            mx: 0.75,
            mt: 0.5,
            alignSelf: 'center'
          }}
        />
        <Box sx={{ flex: 1 }}>
          {newTags?.length > 0 ? (
            <TagsCell value={newTags} />
          ) : (
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
    if (record.fieldName?.includes('посилання') || record.fieldName === 'links' ||
        record.fieldName === 'docLink' || record.fieldName === 'buyLink') {
      const oldLinks = formatLinks(record.oldValue);
      const newLinks = formatLinks(record.newValue);

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" fontWeight={500}>змінено посилання</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {oldLinks ? (
              <LinksRow title="" links={oldLinks} color="#1976d2" />
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>
            )}
            <TrendingFlatIcon 
              sx={{ 
                fontSize: 20, 
                color: 'text.secondary',
                transform: 'translateY(2px)',
                mx: 0.75 
              }} 
            />
            {newLinks ? (
              <LinksRow title="" links={newLinks} color="#4caf50" />
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>
            )}
          </Box>
        </Box>
      );
    }
    if (record.fieldName === 'колір') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" fontWeight={500}>змінено колір</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ColorSwatch color={record.oldValue || '#ccc'} size={20} />
            <TrendingFlatIcon 
              sx={{ 
                fontSize: 20, 
                color: 'text.secondary',
                transform: 'translateY(2px)',
                mx: 0.75 
              }} 
            />
            <ColorSwatch color={record.newValue || '#ccc'} size={20} />
          </Box>
        </Box>
      );
    }

    if (record.fieldName === 'фото') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" fontWeight={500}>змінено фото</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {record.oldValue && <ImagePreview imageUrl={record.oldValue} size={28} />}
            <TrendingFlatIcon 
              sx={{ 
                fontSize: 20, 
                color: 'text.secondary',
                transform: 'translateY(2px)',
                mx: 0.75 
              }} 
            />
            {record.newValue && <ImagePreview imageUrl={record.newValue} size={28} />}
          </Box>
        </Box>
      );
    }

    if (record.fieldName) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            змінено {record.fieldName}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            "{record.oldValue || 'порожньо'}"
          </Typography>
          <TrendingFlatIcon 
            sx={{ 
              fontSize: 20, 
              color: 'text.secondary',
              transform: 'translateY(2px)',
              mx: 0.75 
            }} 
          />
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            "{record.newValue || 'порожньо'}"
          </Typography>
        </Box>
      );
    }

    return 'внесено зміни';
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
            {record.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              {record.userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0.5 }}>
              {getEntityTypeChip()}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                "{record.entityName}"
              </Typography>
            </Box>
          </Box>
          {getActionChip()}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            {formatChangeDescription()}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {new Date(record.time).toLocaleString('uk-UA')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HistoryItem;

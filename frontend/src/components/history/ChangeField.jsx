import { Box, Typography } from '@mui/material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ColorSwatch from './ColorSwatch';
import ImagePreview from './ImagePreview';
import LinksRow from '../component/linksBlock/LinksRow';
import TagsCell from '../componentsTablePage/componentsTable/TagsCell';

const ChangeField = ({
  field,
  oldValue,
  newValue,
  entityTypeId,
  getFieldDisplayName,
  isIdField
}) => {

  const formatValue = (value = '') => {
    if (value === null || value === undefined || value === ''){
      return 'порожньо';
    }
    if (typeof value === 'string'){
      return value;
    }
    if (typeof value === 'number'){
      return value.toString();
    }
    if (Array.isArray(value)){
      return `[${value.length} елементів]`;
    }
    if (typeof value === 'boolean'){
      return value ? 'так' : 'ні';
    }
    if (typeof value === 'object'){
      return value.name || value.title || `[об'єкт]`;
    }
    return String(value);
  };

  const isPhotoField = (fieldName) => {
  const photoFields = [
    'image','photo','фотоUrl','avatar','profilePicture',
    'picture','photoUrl','profilePhoto','imageUrl',
    'PhotoUrl','PHOTO_URL','photo_url'
  ];
  return photoFields.some(f => f.toLowerCase() === fieldName.toLowerCase());
};

  if (isIdField(field)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {getFieldDisplayName(field, entityTypeId)}:
        </Typography>
        <Typography variant="body2" fontWeight={500}>Внесено зміни</Typography>
      </Box>
    );
  }

  if (isPhotoField(field)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {field.toLowerCase().includes('avatar') ? 'Avatar' : 'Photo'}
        </Typography>
        {oldValue && <ImagePreview imageUrl={oldValue} size={28} />}
        <TrendingFlatIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        {newValue && <ImagePreview imageUrl={newValue} size={28} />}
      </Box>
    );
  }

  if (['links','DocumentationLink','SupplierLink','Url', 'DocumentUrl'].includes(field)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>Links:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {oldValue ? (
            <LinksRow title="" links={Array.isArray(oldValue) ? oldValue : [oldValue]} color="#1976d2" />
          ) : <Typography variant="body2" sx={{ fontStyle: 'italic' }}>no links</Typography>}
          <TrendingFlatIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          {newValue ? (
            <LinksRow title="" links={Array.isArray(newValue) ? newValue : [newValue]} color="#4caf50" />
          ) : <Typography variant="body2" sx={{ fontStyle: 'italic' }}>no links</Typography>}
        </Box>
      </Box>
    );
  }

  if (['теги','tags'].includes(field)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2" fontWeight={500}>Змінено теги</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            {Array.isArray(oldValue) && oldValue.length > 0 ? <TagsCell value={oldValue} /> : <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>}
          </Box>
          <TrendingFlatIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            {Array.isArray(newValue) && newValue.length > 0 ? <TagsCell value={newValue} /> : <Typography variant="body2" sx={{ fontStyle: 'italic' }}>немає</Typography>}
          </Box>
        </Box>
      </Box>
    );
  }

  if (['color','CardColor'].includes(field)) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" fontWeight={500}>{getFieldDisplayName(field, entityTypeId)}</Typography>
        <ColorSwatch color={String(oldValue || '#f0f0f0')} size={20} />
        <TrendingFlatIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <ColorSwatch color={String(newValue || '#f0f0f0')} size={20} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" fontWeight={500}>{getFieldDisplayName(field, entityTypeId)}:</Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{formatValue(oldValue)}"</Typography>
      <TrendingFlatIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{formatValue(newValue)}"</Typography>
    </Box>
  );
};

export default ChangeField;
import React, { useMemo } from 'react';
import {
  Paper, IconButton, Stack, Typography, Box, Button,
  FormControl, InputLabel, Select, MenuItem, Divider, CircularProgress, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

const ScannedItemCard = ({
  item,
  index,
  categories,
  isCategoriesLoading,
  isAnyLoading,
  currentCategoryId,
  itemImage,
  onRemoveCard,
  onItemFileChange,
  onRemoveItemFile,
  onCategoryChange,
  onTriggerCreateCategory,
  onFieldChange
}) => {

  const itemPreviewUrl = useMemo(() => {
    return itemImage ? URL.createObjectURL(itemImage) : null;
  }, [itemImage]);

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid #e0e0e0', position: 'relative' }}
    >
      <IconButton
        onClick={() => onRemoveCard(index)}
        disabled={isAnyLoading}
        sx={{
          position: 'absolute', top: 12, right: 12,
          color: 'text.secondary',
          '&:hover': { color: 'error.main', bgcolor: 'rgba(211, 47, 47, 0.04)' }
        }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="subtitle1" sx={{ bgcolor: '#6a11cb', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: '600', fontSize: '0.9rem' }}>
          Компонент №{index + 1}
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">

        <Box sx={{ width: { xs: '100%', lg: 160 }, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="label"
            sx={{
              width: 160, height: 160, borderRadius: 3, border: '2px dashed #ccc',
              overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
              '&:hover': { borderColor: '#6a11cb' }
            }}
          >
            <input
              type="file" hidden accept="image/*"
              disabled={isAnyLoading}
              onChange={(e) => onItemFileChange(index, e)}
            />
            {itemPreviewUrl ? (
              <img src={itemPreviewUrl} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <ImageIcon sx={{ fontSize: 40, color: '#bbb', mb: 0.5 }} />
                <Typography variant="caption" color="text.secondary" textAlign="center" px={1}>
                  Натисніть, щоб додати фото
                </Typography>
              </>
            )}
          </Box>
          {itemImage && (
            <Button
              size="small" color="error" startIcon={<DeleteIcon />}
              onClick={() => onRemoveItemFile(index)}
              disabled={isAnyLoading}
            >
              Видалити фото
            </Button>
          )}
        </Box>

        <Stack spacing={2.5} sx={{ flex: 1, width: '100%' }}>
          <FormControl fullWidth disabled={isAnyLoading || isCategoriesLoading} size="small">
            <InputLabel>Категорія *</InputLabel>
            <Select
              value={currentCategoryId}
              label="Категорія *"
              onChange={(e) => onCategoryChange(index, e.target.value)}
            >
              {isCategoriesLoading ? (
                <MenuItem disabled value=""><CircularProgress size={16} sx={{ mr: 1 }} /> Завантаження...</MenuItem>
              ) : categories.length === 0 ? (
                <MenuItem disabled value="">Немає доступних категорій</MenuItem>
              ) : (
                categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))
              )}

              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                value=""
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerCreateCategory(index);
                }}
                sx={{
                  color: '#6a11cb', fontWeight: '600', justifyContent: 'center', fontSize: '0.9rem',
                  '&:hover': { backgroundColor: 'rgba(106, 17, 203, 0.08)' }
                }}
              >
                + Створити нову категорію
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth size="small" label="Назва *" value={item.name || ''}
            onChange={(e) => onFieldChange(index, 'name', e.target.value)}
            disabled={isAnyLoading} required
          />

          <TextField
            fullWidth multiline rows={3} size="small" label="Опис" value={item.description || ''}
            onChange={(e) => onFieldChange(index, 'description', e.target.value)}
            disabled={isAnyLoading}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Ціна (₴)" size="small" fullWidth type="number" placeholder="0" value={item.price || ''}
              onChange={(e) => onFieldChange(index, 'price', e.target.value)} disabled={isAnyLoading}
            />
            <TextField
              label="Кількість" size="small" fullWidth type="number" placeholder="0" value={item.quantity || ''}
              onChange={(e) => onFieldChange(index, 'quantity', e.target.value)} disabled={isAnyLoading}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Посилання на документацію" size="small" fullWidth placeholder="Вставте посилання" value={item.documentationLink || ''}
              onChange={(e) => onFieldChange(index, 'documentationLink', e.target.value)} disabled={isAnyLoading}
            />
            <TextField
              label="Посилання на магазин" size="small" fullWidth placeholder="Вставте посилання" value={item.supplierLink || ''}
              onChange={(e) => onFieldChange(index, 'supplierLink', e.target.value)} disabled={isAnyLoading}
            />
          </Stack>
        </Stack>

      </Stack>
    </Paper>
  );
};

export default ScannedItemCard;
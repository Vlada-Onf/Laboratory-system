import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, Box, IconButton, Typography,
  FormControl, Select, MenuItem
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useCategoriesStore } from '../../../store/useCategoriesStore';
import { eventBus } from '../../../utils/eventBus';
import ImagePreview from '../../history/ImagePreview';

const ComponentModal = ({
  open,
  onClose,
  onSubmit,
  component,
  isEditing = false
}) => {
  const categories = useCategoriesStore(state => state.categories);
  const categoryOptions = useMemo(() => 
    categories.map(cat => ({ value: cat.id, label: cat.title })), 
  [categories]
  );

  const defaultForm = useMemo(() => ({
    name: isEditing && component?.name || '',
    description: isEditing && component?.description || '',
    price: isEditing && component?.price?.toString() || '',
    quantity: isEditing && component?.quantity?.toString() || '',
    burntQuantity: isEditing && component?.burntQuantity?.toString() || '',
    categoryId: isEditing && component?.categoryId || '',
    tagInput: '',
    photo: null,
  }), [isEditing, component]);

  const defaultTags = useMemo(() =>
    isEditing && component?.tags ? [...component.tags] : [],
  [isEditing, component]);

  const [form, setForm] = useState(defaultForm);
  const [tags, setTags] = useState(defaultTags);

  const handleCloseModal = useCallback(() => {
    setForm(defaultForm);
    setTags(defaultTags);
    onClose();
  }, [defaultForm, defaultTags, onClose]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = field === 'photo' ? e.target.files[0] : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setForm(prev => ({ ...prev, categoryId: e.target.value }));
  }, []);

  const addTag = useCallback(() => {
    const newTag = form.tagInput?.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setForm(prev => ({ ...prev, tagInput: '' }));
    }
  }, [form.tagInput, tags]);

  const removeTag = useCallback((tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

const getCategoryName = useCallback((categoryId) => {
  return categories.find(cat => cat.id === categoryId)?.title || 'Не вибрано';
}, [categories]);


  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const getImageUrl = useCallback(() => {
    if (form.photo) return URL.createObjectURL(form.photo);
    return component?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEZvdG88L3RleHQ+PC9zdmc+';
  }, [form.photo, component?.image]);

const handleSubmit = useCallback((e) => {
  e.preventDefault();

  const newComponent = {
    id: component?.id || crypto.randomUUID(),
    image: getImageUrl(),
    ...form,
    price: parseFloat(form.price) || 0,
    quantity: parseInt(form.quantity) || 0,
    burntQuantity: parseInt(form.burntQuantity) || 0,
    tags,
  };

  const baseEventData = {
    userId: 'currentUser', userName: 'Дарина',
    entityTypeId: 4, entityTypeName: 'Компонент',
    entityId: newComponent.id, entityName: form.name,
  };

  if (isEditing) {
    const oldPrice = component?.price?.toString() || '';
    const oldQuantity = component?.quantity?.toString() || '';
    const oldBurnt = component?.burntQuantity?.toString() || '';

  if (component?.name !== form.name) {
    eventBus.emit('entity:updated', { ...baseEventData, actionName: 'Оновлено', fieldName: 'назва', oldValue: component?.name || '', newValue: form.name });
  }

  if (component?.description !== form.description) {
    eventBus.emit('entity:updated', { ...baseEventData, actionName: 'Оновлено', fieldName: 'опис', oldValue: component?.description || '', newValue: form.description });
  }

  if (oldPrice !== form.price) {
    eventBus.emit('entity:updated', { ...baseEventData, actionName: 'Оновлено', fieldName: 'ціна', oldValue: oldPrice, newValue: form.price });
  }

  if (oldQuantity !== form.quantity) {
    eventBus.emit('entity:updated', { ...baseEventData, actionName: 'Оновлено', fieldName: 'кількість', oldValue: oldQuantity, newValue: form.quantity });
  }

  if (oldBurnt !== form.burntQuantity) {
    eventBus.emit('entity:updated', { ...baseEventData, actionName: 'Оновлено', fieldName: 'спалено', oldValue: oldBurnt, newValue: form.burntQuantity });
  }

  if (form.photo) {
    eventBus.emit('entity:updated', {
      ...baseEventData,
      actionName: 'Оновлено',
      fieldName: 'фото',
      oldValue: component?.image || null,
      newValue: URL.createObjectURL(form.photo)
    });
  }

  if (component?.categoryId != form.categoryId) {
    eventBus.emit('entity:updated', {
      ...baseEventData,
      actionName: 'Оновлено',
      fieldName: 'категорія',
      oldValue: getCategoryName(component?.categoryId),
      newValue: getCategoryName(form.categoryId)
    });
  }

  const oldTagsStr = component?.tags?.join(', ') || 'немає';
  const newTagsStr = tags.join(', ') || 'немає';
  if (oldTagsStr !== newTagsStr) {
    eventBus.emit('entity:updated', {
      ...baseEventData,
      actionName: 'Оновлено',
      fieldName: 'теги',
      oldValue: oldTagsStr,
      newValue: newTagsStr
    });
  }
}

else {
    eventBus.emit('entity:created', {
      ...baseEventData,
      actionName: 'Створено'
    });
  }

  onSubmit(newComponent);
  handleCloseModal();
}, [form, tags, component, isEditing, onSubmit, getImageUrl, handleCloseModal, categories, getCategoryName]);


  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Редагувати компонент' : 'Додати компонент'}</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Фото
              </Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', py: 1.5 }}>
                {form.photo ? form.photo.name : 'Вибрати фото'}
                <input type="file" accept="image/*" hidden onChange={handleInputChange('photo')} />
              </Button>
              {form.photo && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 4 }}
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Категорія
              </Typography>
              <FormControl fullWidth required>
                <Select
                  value={form.categoryId || ''}
                  onChange={handleCategoryChange}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Назва
              </Typography>
              <TextField
                value={form.name || ''}
                onChange={handleInputChange('name')}
                fullWidth
                required
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Опис
              </Typography>
              <TextField
                value={form.description || ''}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Ціна (₴)
              </Typography>
              <TextField
                type="number"
                value={form.price || ''}
                onChange={handleInputChange('price')}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Кількість
              </Typography>
              <TextField
                type="number"
                value={form.quantity || ''}
                onChange={handleInputChange('quantity')}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Спалено
              </Typography>
              <TextField
                type="number"
                value={form.burntQuantity || ''}
                onChange={handleInputChange('burntQuantity')}
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Теги
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  placeholder="Додати тег"
                  value={form.tagInput || ''}
                  onChange={handleInputChange('tagInput')}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  size="small"
                />
                <IconButton
                  onClick={addTag}
                  sx={{
                    alignSelf: 'flex-end',
                    height: '40px',
                    width: '40px',
                    p: 0
                  }}
                  disabled={!form.tagInput?.trim()}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => removeTag(tag)} size="small" />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Скасувати</Button>
          <Button type="submit" variant="contained">
            {isEditing ? 'Зберегти зміни' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ComponentModal;

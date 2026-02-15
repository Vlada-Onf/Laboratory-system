import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, Box, IconButton, Typography,
  FormControl, Select, MenuItem
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useCategoriesStore } from '../../../store/useCategoriesStore';
import { eventBus } from '../../../utils/eventBus';
import { useTagsStore } from '../../../store/useTagsStore';

const ComponentModal = ({
  open,
  onClose,
  onSubmit,
  component,
  isEditing = false
}) => {
  const categories = useCategoriesStore(state => state.categories);
  const tagsStore = useTagsStore();
  const categoryOptions = useMemo(() => 
    categories.map(cat => ({ value: cat.id, label: cat.title || cat.name })), 
  [categories]
  );

  const defaultForm = useMemo(() => ({
  name: isEditing && component?.name || '',
  description: isEditing && component?.description || '',
  price: isEditing && component?.price?.toString() || '',
  quantity: isEditing && component?.quantity?.toString() || '',
  burntQuantity: isEditing && component?.burntQuantity?.toString() || '',
  categoryId: isEditing && component?.categoryId || '',
  documentationLink: isEditing && (component?.documentationLink || component?.docLink) || '',
  supplierLink: isEditing && (component?.supplierLink || component?.buyLink) || '',
  tagInput: '',
  photo: null,
}), [isEditing, component]);

  const defaultTags = useMemo(() =>
    isEditing && component?.tags ? 
      typeof component.tags === 'string' 
        ? component.tags.split(',').filter(Boolean) 
        : Array.isArray(component.tags) 
          ? component.tags 
          : [] 
    : [],
  [isEditing, component]);

  const [form, setForm] = useState(defaultForm);
  const [tags, setTags] = useState(defaultTags);

  useEffect(() => {
    setForm(defaultForm);
  }, [defaultForm]);

  useEffect(() => {
    setTags(defaultTags);
  }, [defaultTags]);

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


  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

 
const handleSubmit = useCallback(async (e) => {
  e.preventDefault();

  try {
    const tagIds = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await tagsStore.createTag(tagName);
        return tag.id;
      })
    );

    const formData = {
      categoryId: form.categoryId,
  name: form.name,
  description: form.description,
  quantity: parseInt(form.quantity) || 0,
  price: parseFloat(form.price) || 0,
  photoUrl: form.photo ? URL.createObjectURL(form.photo) : '',
  supplierLink: form.supplierLink || "string",
  documentationLink: form.documentationLink || "string",
  tagIds: tagIds,
  createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };


    const baseEventData = {
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 4,
      entityTypeName: 'Компонент',
      entityId: component?.id || crypto.randomUUID(),
      entityName: form.name,
    };

    if (isEditing) {
      const oldPrice = component?.price?.toString() || '';
      const oldQuantity = component?.quantity?.toString() || '';
      const oldBurnt = component?.burntQuantity?.toString() || '';

      if (component?.name !== form.name) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'назва',
          oldValue: component?.name || '',
          newValue: form.name
        });
      }

      if (component?.description !== form.description) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'опис',
          oldValue: component?.description || '',
          newValue: form.description
        });
      }

      if (oldPrice !== form.price) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'ціна',
          oldValue: oldPrice,
          newValue: form.price
        });
      }

      if (oldQuantity !== form.quantity) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'кількість',
          oldValue: oldQuantity,
          newValue: form.quantity
        });
      }

      if (oldBurnt !== form.burntQuantity) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'спалено',
          oldValue: oldBurnt,
          newValue: form.burntQuantity
        });
      }

      if (form.photo) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'фото',
          oldValue: component?.photoUrl || null,
          newValue: URL.createObjectURL(form.photo)
        });
      }

      if (component?.categoryId !== form.categoryId) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'категорія',
          oldValue: categories.find(cat => cat.id === component?.categoryId)?.title || 'Не вибрано',
          newValue: categories.find(cat => cat.id === form.categoryId)?.title || 'Не вибрано'
        });
      }

      const oldTagsStr = Array.isArray(component?.tags) 
        ? component.tags.join(', ') 
        : (component?.tags || '').toString();
      const newTagsStr = tags.join(', ');
      
      if (oldTagsStr !== newTagsStr) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'теги',
          oldValue: oldTagsStr || 'немає',
          newValue: newTagsStr || 'немає'
        });
      }
    } else {
      eventBus.emit('entity:created', {
        ...baseEventData,
        actionName: 'Створено'
      });
    }

    onSubmit(formData);
    handleCloseModal();
  } catch (error) {
    console.error('💥 Помилка збереження:', error);
  }
}, [form, tags, component, isEditing, onSubmit, handleCloseModal, categories, tagsStore]);

  
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
    Посилання на документацію
  </Typography>
  <TextField
    value={form.documentationLink || ''}
    onChange={handleInputChange('documentationLink')}
    fullWidth
    placeholder="Вставте посилання"
  />
</Box>

<Box>
  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
    Посилання на магазин
  </Typography>
  <TextField
    value={form.supplierLink || ''}
    onChange={handleInputChange('supplierLink')}
    fullWidth
    placeholder="Вставте посилання"
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

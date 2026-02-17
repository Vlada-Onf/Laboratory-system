import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, Box, IconButton, Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { eventBus } from '../../../utils/eventBus';
import { useComponentsStore } from '@store/useComponentsStore';

const SchematicModal = ({ open, onClose, onSave, schematic, componentId }) => {
  const isEditing = !!schematic;
  const { components } = useComponentsStore();

  const getComponentName = useCallback((id) => {
    const component = components.find(c => c.id === id);
    return component?.name || `компонент ${id}`;
  }, [components]);

  const parseLinksFromDb = useCallback((schematicData) => {
    if (schematicData?.links && Array.isArray(schematicData.links)) {
      return schematicData.links;
    }
    
    if (schematicData?.additionalLinks) {
      if (Array.isArray(schematicData.additionalLinks)) {
        return schematicData.additionalLinks;
      }
      
      const linksArray = schematicData.additionalLinks
        .split(',')
        .map(link => link.trim())
        .filter(Boolean);
      
      return linksArray;
    }
    
    return []; 
  }, []);
  const defaultLinks = useMemo(() => {
    if (isEditing) {
      return parseLinksFromDb(schematic);
    }
    return [];
  }, [isEditing, schematic, parseLinksFromDb]);

  const defaultForm = useMemo(() => ({
    title: isEditing && schematic?.title || '',
    description: isEditing && schematic?.description || '',
    photo: null,
    linkInput: '',
  }), [isEditing, schematic]);

  const [form, setForm] = useState(defaultForm);
  const [links, setLinks] = useState(defaultLinks);

  React.useEffect(() => {
    setForm(defaultForm);
    setLinks(defaultLinks);
  }, [defaultForm, defaultLinks]);

  const handleCloseModal = () => {
    setForm(defaultForm);
    setLinks(defaultLinks);
    onClose();
  };

  const handleInputChange = useCallback((field) => (e) => {
    const value = field === 'photo' ? e.target.files[0] : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const getImageUrl = useCallback(() => {
    if (form.photo) return URL.createObjectURL(form.photo);
    return schematic?.photoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEZvdG88L3RleHQ+PC9zdmc+';
  }, [form.photo, schematic?.photoUrl]);

  const addLink = useCallback(() => {
    const newLink = form.linkInput?.trim();
    if (newLink && !links.includes(newLink)) {
      setLinks(prev => [...prev, newLink]);
      setForm(prev => ({ ...prev, linkInput: '' }));
    }
  }, [form.linkInput, links]);

  const removeLink = useCallback((linkToRemove) => {
    setLinks(prev => prev.filter(link => link !== linkToRemove));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLink();
    }
  }, [addLink]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const additionalLinksString = links.join(',');
    
    const apiData = {
      id: schematic?.id || crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim() || "string",
      photoUrl: getImageUrl() || "string",
      links: links, 
      additionalLinks: additionalLinksString,
      componentId: componentId,
    };

    const baseEventData = {
      userId: 'currentUser',
      userName: 'Дарина',
      entityTypeId: 5,
      entityTypeName: 'Схему',
      entityId: apiData.id,
      entityName: `${form.title.trim()} (${getComponentName(componentId)})`
    };

    if (isEditing) {
      const oldTitle = schematic?.title || '';
      const oldDesc = schematic?.description || '';

      if (oldTitle !== form.title.trim()) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'назва',
          oldValue: oldTitle,
          newValue: form.title.trim()
        });
      }

      if (oldDesc !== form.description.trim()) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'опис',
          oldValue: oldDesc,
          newValue: form.description.trim()
        });
      }

      if (form.photo) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'фото',
          oldValue: schematic?.photoUrl || null,
          newValue: URL.createObjectURL(form.photo)
        });
      }

      if (JSON.stringify(schematic?.links || schematic?.additionalLinks || []) !== JSON.stringify(links)) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'посилання',
          oldValue: JSON.stringify({ links: parseLinksFromDb(schematic) }),
          newValue: JSON.stringify({ links })
        });
      }
    } else {
      eventBus.emit('entity:created', { ...baseEventData, actionName: 'Створено' });
    }

    onSave(apiData);
    handleCloseModal();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Редагувати схему' : 'Додати схему'}</DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Фото схеми
              </Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ textTransform: 'none', py: 1.5 }}>
                {form.photo ? form.photo.name : 'Вибрати фото'}
                <input type="file" accept="image/*" hidden onChange={handleInputChange('photo')} />
              </Button>
              {form.photo && (
                <Box sx={{ mt: 1 }}>
                  <img src={getImageUrl()} alt="Preview" style={{ width: '150px', height: '120px', objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Назва схеми *
              </Typography>
              <TextField value={form.title || ''} onChange={handleInputChange('title')} fullWidth required />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Опис
              </Typography>
              <TextField value={form.description || ''} onChange={handleInputChange('description')} multiline rows={3} fullWidth />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Посилання ({links.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  placeholder="Введіть посилання"
                  value={form.linkInput || ''}
                  onChange={handleInputChange('linkInput')}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  size="small"
                />
                <IconButton
                  onClick={addLink}
                  sx={{ alignSelf: 'flex-end', height: '40px', width: '40px', p: 0 }}
                  disabled={!form.linkInput?.trim()}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {links.map((link) => (
                  <Chip key={link} label={link} onDelete={() => removeLink(link)} size="small" />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Скасувати</Button>
          <Button type="submit" variant="contained" disabled={!form.title?.trim()}>
            {isEditing ? 'Зберегти зміни' : 'Додати схему'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SchematicModal;

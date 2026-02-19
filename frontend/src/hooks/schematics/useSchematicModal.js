import { useState, useCallback } from 'react';
import { eventBus } from '../../utils/eventBus';
import { useComponentsStore } from '@store/useComponentsStore';

export const useSchematicModal = ({ schematic, componentId, onSave, isEditing }) => {
  const { components } = useComponentsStore();

  const getComponentName = useCallback((id) => {
    const component = components.find(c => c.id === id);
    return component?.name || `компонент ${id}`;
  }, [components]);

  const parseLinksFromDb = useCallback((schematicData) => {
    if (schematicData?.links && Array.isArray(schematicData.links)) return schematicData.links;
    if (schematicData?.additionalLinks) {
      if (Array.isArray(schematicData.additionalLinks)) return schematicData.additionalLinks;
      return schematicData.additionalLinks.split(',').map(link => link.trim()).filter(Boolean);
    }
    return [];
  }, []);

  const [form, setForm] = useState(() => ({
    title: isEditing ? (schematic?.title || '') : '',
    description: isEditing ? (schematic?.description || '') : '',
    photo: null,
    linkInput: '',
  }));

  const [links, setLinks] = useState(() =>
    isEditing ? parseLinksFromDb(schematic) : []
  );

  const resetForm = useCallback(() => {
    setForm({
      title: isEditing ? (schematic?.title || '') : '',
      description: isEditing ? (schematic?.description || '') : '',
      photo: null,
      linkInput: '',
    });
    setLinks(isEditing ? parseLinksFromDb(schematic) : []);
  }, [isEditing, schematic, parseLinksFromDb]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = field === 'photo' ? e.target.files[0] : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const getImageUrl = useCallback(() => {
    if (form.photo) return URL.createObjectURL(form.photo);
    return schematic?.photoUrl ||
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEZvdG88L3RleHQ+PC9zdmc+';
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

  const handleSubmit = useCallback((e) => {
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
      const oldLinks = parseLinksFromDb(schematic);
      if (JSON.stringify(oldLinks) !== JSON.stringify(links)) {
        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
          fieldName: 'посилання',
          oldValue: JSON.stringify({ links: oldLinks }),
          newValue: JSON.stringify({ links })
        });
      }
    } else {
      eventBus.emit('entity:created', { ...baseEventData, actionName: 'Створено' });
    }
    onSave(apiData);
    resetForm();
  }, [
    schematic,
    componentId,
    form,
    links,
    getComponentName,
    getImageUrl,
    parseLinksFromDb,
    onSave,
    resetForm,
    isEditing
  ]);

  return {
    form,
    links,
    getImageUrl,
    handleInputChange,
    addLink,
    removeLink,
    handleKeyPress,
    handleSubmit,
    resetForm,
    isEditing,
    getComponentName,
    parseLinksFromDb
  };
};

import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button,} from '@mui/material';
import AddCategoryForm from './AddCategoryForm';
import { eventBus } from '../../utils/eventBus';

const AddCategoryModal = ({ open, onClose, onAdd, onEdit, category }) => {
  const isEditing = !!category;

  const handleSubmit = (formData) => {
  const name = formData.name;
  const description = formData.description;
  const color = formData.color;
  const photoFile = formData.photo;

  const imageUrl = photoFile
    ? URL.createObjectURL(photoFile)
    : category?.image || 'data:image/svg+xml;base64,...';

  const data = {
    id: category?.id,
    title: name,
    description,
    image: imageUrl,
    color,
  };

  if (isEditing && onEdit) {
    const baseEventData = {
      userId: 'currentUser',
      userName: 'Дарина',
      actionName: 'Оновлено',
      entityTypeId: 1,
      entityTypeName: 'Категорія',
      entityId: category.id,
      entityName: category.title || name,
    };

    if (category.title !== name) {
      eventBus.emit('entity:updated', {
        ...baseEventData,
        fieldName: 'назва',
        oldValue: category.title,
        newValue: name
      });
    }

    if (category.description !== description) {
      eventBus.emit('entity:updated', {
        ...baseEventData,
        fieldName: 'опис',
        oldValue: category.description,
        newValue: description
      });
    }

   if (category.color !== color) {
  eventBus.emit('entity:updated', {
    ...baseEventData,
    fieldName: 'колір',
    oldValue: category.color,
    newValue: color
  });
}

if (photoFile !== null && photoFile !== undefined) {
  eventBus.emit('entity:updated', {
    ...baseEventData,
    fieldName: 'фото',
    oldValue: category?.image,
    newValue: URL.createObjectURL(photoFile)
  });
}

    onEdit(data);
  } else if (!isEditing && onAdd) {
    eventBus.emit('entity:created', {
      userId: 'currentUser',
      userName: 'Дарина',
      actionName: 'Створено',
      entityTypeId: 1,
      entityTypeName: 'Категорію',
      entityId: data.id || `cat-${Date.now()}`,
      entityName: name
    });
    onAdd(data);
  }

  onClose();
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Редагувати категорію' : 'Додати категорію'}</DialogTitle>
      <DialogContent>
        <AddCategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;

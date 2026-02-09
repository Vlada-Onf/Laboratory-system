import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import AddCategoryForm from './AddCategoryForm';

const AddCategoryModal = ({ open, onClose, onAdd, onEdit, category }) => {
  const isEditing = !!category;

  const handleSubmit = (formData) => {
    console.log('formData in AddCategoryModal', formData);
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
      onEdit(data);
    } else if (!isEditing && onAdd) {
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

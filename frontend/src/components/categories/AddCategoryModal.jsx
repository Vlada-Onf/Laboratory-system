import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddCategoryForm from './AddCategoryForm';

const AddCategoryModal = ({ open, onClose, onAdd, onEdit, category }) => {
  const isEditing = !!category;

  const handleSubmit = (formData) => {
    const data = {
      id: category?.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      photo: formData.photo,
      cardColor: formData.color,
    };

    if (isEditing && onEdit) {
      onEdit(data);
    } else if (!isEditing && onAdd) {
      onAdd(data);
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Редагувати категорію' : 'Додати категорію'}</DialogTitle>
      <DialogContent>
        <AddCategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;

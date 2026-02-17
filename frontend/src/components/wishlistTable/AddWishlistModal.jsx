import React from 'react';
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Slide,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistStore } from '@store/useWishlistStore';
import { eventBus } from '../../utils/eventBus';
import AddWishlistForm from './AddWishlistForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddWishlistModal = ({ open, onClose, row }) => {
  console.log('🎭 MODAL open:', open, 'row:', row);
  
  const { createWishlist, updateWishlistDetails } = useWishlistStore();
  const isEditing = !!row?.id && row.id !== 'new';

  const handleSubmit = async (formData) => {
    try {
      const baseEventData = {
        userId: 'currentUser',
        userName: 'Дарина',
        entityTypeId: 6,
        entityTypeName: 'Запис у списку бажань',
        entityId: row?.id || `wishlist-${Date.now()}`,
        entityName: formData.name,
      };

      if (isEditing && row?.id) {
        await updateWishlistDetails(row.id, formData);

        eventBus.emit('entity:updated', {
          ...baseEventData,
          actionName: 'Оновлено',
        });
      } else {
        await createWishlist(formData);

        eventBus.emit('entity:created', {
          ...baseEventData,
          actionName: 'Створено',
        });
      }

      onClose();
    } catch (error) {
      console.error('Помилка:', error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 3,
        pb: 2
      }}>
        <span>{isEditing ? 'Редагувати запис' : 'Додати до списку бажань'}</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <AddWishlistForm 
          initialData={row} 
          onSubmit={handleSubmit} 
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWishlistModal;

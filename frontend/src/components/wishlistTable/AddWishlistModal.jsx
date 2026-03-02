import React from 'react';
import {Dialog, DialogTitle, DialogContent, Slide, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useWishlistStore } from '@store/useWishlistStore';
import AddWishlistForm from './AddWishlistForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddWishlistModal = ({ open, onClose, row }) => {
  const { createWishlist, updateWishlistDetails } = useWishlistStore();
  const isEditing = !!row?.id && row.id !== 'new';

  const handleSubmit = async (formData) => {
    try {
      if (isEditing && row?.id) {
        await updateWishlistDetails(row.id, formData);
      } else {
        await createWishlist(formData);
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

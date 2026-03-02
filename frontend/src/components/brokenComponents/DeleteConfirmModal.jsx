import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Видалити запис?",
  description = "Ця дія не може бути скасована.",
  itemName = "",
  loading = false
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon color="error" />
        <Typography variant="h6" color="error.main">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {description}
          {itemName && (
            <Typography variant="body1" fontWeight={500} sx={{ mt: 1 }}>
              "{itemName}"
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Скасувати
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
        >
          {loading ? 'Видаляємо...' : 'Видалити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmModal;

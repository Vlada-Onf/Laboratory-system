import {Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  entityTypeName = 'Компонент'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Видалити {entityTypeName}?</DialogTitle>
      <DialogContent>
        <Typography>
          Ви впевненні що хочете видалити? Цю дію не можна скасувати.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;

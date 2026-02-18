import {Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { eventBus } from '../../utils/eventBus';

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  entityName,
  entityTypeId = 4,
  entityTypeName = 'Компонент'
}) => {
  const handleConfirm = () => {
    eventBus.emit('entity:deleted', {
      userId: 'currentUser',
      userName: 'Дарина',
      actionName: 'Видалено',
      entityTypeId,
      entityTypeName,
      entityId: null,
      entityName
    });

    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Видалити {entityTypeName}?</DialogTitle>
      <DialogContent>
        <Typography>
          Цей {entityTypeName.toLowerCase()} "<strong>{entityName}</strong>" буде 
          <strong> безповоротно видалено</strong>. Цю дію не можна скасувати.
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

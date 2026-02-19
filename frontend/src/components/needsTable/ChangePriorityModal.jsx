import {Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress } from '@mui/material';

const ChangePriorityModal = ({
  openPriorityModal,
  importances,
  newPriorityId,
  currentPriorityId,
  completionReason,
  isSavingPriority,
  onClose,
  onSubmit,
  onPriorityChange,
  onReasonChange
}) => {
  return (
    <Dialog open={openPriorityModal} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Змінити пріоритет</DialogTitle>

      <DialogContent>
        <TextField
          select
          fullWidth
          label="Новий пріоритет"
          value={newPriorityId || ''}
          onChange={(e) => onPriorityChange('newPriorityId', e.target.value)}
          sx={{ mt: 2 }}
        >
          {importances.map((importance) => (
            <MenuItem key={importance.id} value={importance.id}>
              {importance.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Причина зміни (необов'язково)"
          multiline
          rows={3}
          value={completionReason}
          onChange={(e) => onReasonChange('completionReason', e.target.value)}
          sx={{ mt: 2 }}
          placeholder="Опишіть причину зміни пріоритету..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSavingPriority}>
          Скасувати
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSavingPriority || newPriorityId === currentPriorityId}
        >
          {isSavingPriority ? <CircularProgress size={20} /> : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePriorityModal;

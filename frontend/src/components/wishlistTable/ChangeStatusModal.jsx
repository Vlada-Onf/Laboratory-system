import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, CircularProgress
} from '@mui/material';

const ChangeStatusModal = ({
  openStatusModal,
  statuses,
  newStatusId,
  currentStatusId,
  completionReason,
  isSavingStatus,
  onClose,
  onSubmit,
  onStatusChange,
  onReasonChange
}) => {
  return (
    <Dialog open={openStatusModal} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Змінити статус</DialogTitle>

      <DialogContent>
        <TextField
          select
          fullWidth
          label="Новий статус"
          value={newStatusId || ''}
          onChange={(e) => onStatusChange('newStatusId', e.target.value)}
          sx={{ mt: 2 }}
        >
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {status.name}
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
          placeholder="Опишіть причину зміни статусу..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSavingStatus}>
          Скасувати
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSavingStatus || newStatusId === currentStatusId}
        >
          {isSavingStatus ? <CircularProgress size={20} /> : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeStatusModal;

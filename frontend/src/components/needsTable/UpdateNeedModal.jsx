import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNeedsStore } from '@store/useNeedsStore';
import AddNeedForm from './AddNeedForm';

const UpdateNeedModal = ({ open, onClose, row }) => {
  const updateNeedDetails = useNeedsStore(state => state.updateNeedDetails);

  if (!row?.id){
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        id: row.id,
        quantityNeeded: Number(formData.quantityNeeded) || 0,
        description: formData.description || '',
        importanceId: formData.importanceId,
        statusId: formData.statusId,
        completionReason: formData.completionReason || '',
      };
      await updateNeedDetails(row.id, payload);
      onClose();
    } catch (error) {
      console.error('Помилка редагування:', error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редагувати потребу</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <AddNeedForm
          initialData={row}
          onSubmit={handleSubmit}
          mode="edit"
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#08273b',
            borderColor: '#08273b',
            '&:hover': { backgroundColor: '#ffe6dc' }
          }}
        >
          Скасувати
        </Button>
        <Button
          variant="contained"
          type="submit"
          form="add-need-form"
          sx={{
            background: 'linear-gradient(135deg, #08273b, #365468)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)'
            },
          }}
        >
          Зберегти зміни
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateNeedModal;

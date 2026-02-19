import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNeedsStore } from '@store/useNeedsStore';
import AddNeedForm from './AddNeedForm';

const AddNeedModal = ({ open, onClose, row }) => {
  const createNeed = useNeedsStore(state => state.createNeed);

  if (!row) return null;

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        componentId: row.componentId || row.id
      };
      await createNeed(payload);
      onClose();
    } catch (error) {
      console.error('Помилка створення:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Додати до потреб</DialogTitle>
      <DialogContent>
        <AddNeedForm initialData={row} onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <Button sx={{
          color: '#08273b', borderColor: '#08273b',
          '&:hover': { backgroundColor: '#ffe6dc', borderColor: '#08273b' },
        }} onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="contained" sx={{
          background: 'linear-gradient(135deg, #08273b, #365468)',
          color: '#fff',
          '&:hover': { background: 'linear-gradient(135deg, #051926, #20314a)' },
        }} onClick={() => document.getElementById('add-need-form')?.requestSubmit()}>
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNeedModal;

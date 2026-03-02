import { useCallback } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import SchematicForm from './SchematicForm';
import { useSchematicModal } from '../../../hooks/schematics/useSchematicModal';

const SchematicModal = ({ open, onClose, schematic, componentId }) => {
  const {
    form,
    errors,
    handleInputChange,
    handleSubmit,
    isEditing,
    getImageUrl
  } = useSchematicModal({ schematic, componentId, onClose });

  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const onFormSubmit = useCallback((e) => {
    e.preventDefault();
    if (handleSubmit && typeof handleSubmit === 'function') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <form onSubmit={onFormSubmit}>
        <DialogTitle>
          {isEditing ? 'Редагувати схему' : 'Додати схему'}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <SchematicForm
            form={form}
            errors={errors}
            handleInputChange={handleInputChange}
            getImageUrl={getImageUrl}
            isEditing={isEditing}
            schematic={schematic}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            type="button"
            onClick={handleCloseModal}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!form.title?.trim()}
          >
            {isEditing ? 'Зберегти зміни' : 'Додати схему'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SchematicModal;

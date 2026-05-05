import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useComponentForm } from '../../hooks/components/useComponentForm';
import ComponentForm from '../component/componentBlock/ComponentForm';

const ComponentModal = ({open, onClose, onSubmit, component, isEditing = false 
}) => {
  const {
    form,
    tags,
    selectedFile,
    categoryOptions,
    isValid,
    handlers
  } = useComponentForm({
    component,
    isEditing,
    onClose,
    onSubmit
  });

  return (
    <Dialog
      open={open}
      onClose={handlers.handleCloseModal}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handlers.handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Редагувати компонент' : 'Додати компонент'}
        </DialogTitle>

        <DialogContent>
          <ComponentForm
            form={form}
            categoryOptions={categoryOptions}
            selectedFile={selectedFile}
            tags={tags}
            isEditing={isEditing}
            onInputChange={handlers.handleInputChange}
            onCategoryChange={handlers.handleCategoryChange}
            onAddTag={handlers.addTag}
            onRemoveTag={handlers.removeTag}
            onKeyPress={handlers.handleKeyPress}
            tagInput={form.tagInput}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handlers.handleCloseModal}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
          >
            {isEditing ? 'Зберегти зміни' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ComponentModal;

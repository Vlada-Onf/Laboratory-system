import {TextField, Button, Box, Typography, Alert} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const SchematicForm = ({
  form,
  errors,
  handleInputChange,
  getImageUrl,
  isEditing,
  schematic
}) => {
  const onPhotoChange = (e) => {
    handleInputChange('photo')(e);
  };

  const onDocumentChange = (e) => {
    handleInputChange('document')(e);
  };

  const onTitleChange = (e) => handleInputChange('title')(e);
  const onDescriptionChange = (e) => handleInputChange('description')(e);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {Object.values(errors).some(Boolean) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Object.values(errors).filter(Boolean).join('; ')}
        </Alert>
      )}

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Фото схеми *
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth 
          sx={{ textTransform: 'none', py: 1.5, justifyContent: 'flex-start' }}
          startIcon={<AttachFileIcon />}
        >
          {form.photo ? form.photo.name : 'Вибрати фото'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onPhotoChange}
          />
        </Button>
        {errors.photo && (
          <Typography color="error.main" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            {errors.photo}
          </Typography>
        )}
        {form.photo && (
          <Box sx={{ mt: 1 }}>
            <img
              src={getImageUrl()}
              alt="Preview"
              style={{
                width: '150px', height: '120px',
                objectFit: 'cover', borderRadius: 4,
                border: '1px solid #ddd'
              }}
            />
          </Box>
        )}
        {isEditing && schematic?.photoUrl && !form.photo && (
          <Typography variant="caption" color="text.secondary">
            Обране: {schematic.photoUrl.split('/').pop()}
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Документ
        </Typography>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ textTransform: 'none', py: 1.5, justifyContent: 'flex-start' }}
          startIcon={<PictureAsPdfIcon />}
        >
          {form.document ? form.document.name : 'Вибрати PDF/документ'}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={onDocumentChange}
          />
        </Button>
        {form.document && (
          <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2">
              📄 {form.document.name} ({(form.document.size / 1024).toFixed(1)} KB)
            </Typography>
          </Box>
        )}
        {isEditing && schematic?.documentUrl && !form.document && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Обраний: {schematic.documentUrl.split('/').pop()}
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Назва схеми *
        </Typography>
        <TextField
          value={form.title || ''}
          onChange={onTitleChange}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          required
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Опис
        </Typography>
        <TextField
          value={form.description || ''}
          onChange={onDescriptionChange}
          multiline
          rows={3}
          fullWidth
        />
      </Box>

    </Box>
  );
};

export default SchematicForm;

import { Box, Typography, Button } from '@mui/material';

const PhotoUpload = ({selectedFile, photoName, onFileChange,  isOptional = false 
}) => (
  <Box>
    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
      Фото {isOptional ? '(необов\'язково при редагуванні)' : '*'}
    </Typography>
    <Button
      variant="outlined" component="label" fullWidth 
      sx={{ textTransform: 'none', py: 1.5 }}
    >
      {photoName || selectedFile?.name || 'Вибрати фото'}
      <input type="file" accept="image/*" hidden onChange={onFileChange} />
    </Button>
    {selectedFile && (
      <Box sx={{ mt: 1 }}>
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 4}}
        />
      </Box>
    )}
  </Box>
);

export default PhotoUpload;

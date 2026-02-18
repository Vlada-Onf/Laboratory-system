import { Box, Typography, TextField, IconButton, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const TagsInput = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onKeyPress
}) => (
  <Box>
    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
      Теги
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
      <TextField
        placeholder="Додати тег"
        value={tagInput || ''}
        onChange={onTagInputChange}
        onKeyPress={onKeyPress}
        fullWidth
        size="small"
      />
      <IconButton
        onClick={onAddTag}
        sx={{
          alignSelf: 'flex-end',
          height: '40px',
          width: '40px',
          p: 0
        }}
        disabled={!tagInput?.trim()}
      >
        <AddCircleIcon />
      </IconButton>
    </Box>
    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} onDelete={() => onRemoveTag(tag)} size="small" />
      ))}
    </Box>
  </Box>
);

export default TagsInput;

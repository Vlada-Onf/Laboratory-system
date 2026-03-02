import {Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Folder as SchematicIcon,
  Widgets as ComponentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSearchStore } from '../../store/useSearchStore';

const SearchResults = () => {
  const navigate = useNavigate();
  const searchQuery = useSearchStore(state => state.searchQuery);
  const searchResults = useSearchStore(state => state.searchResults);
  const isSearching = useSearchStore(state => state.isSearching);
  const clearSearch = useSearchStore(state => state.clearSearch);

  if (!searchQuery?.trim() && !isSearching){
    return null;
  }

  const schematics = searchResults.filter(item => item.type === 'schematic');
  const components = searchResults.filter(item => item.type === 'component');

  const handleItemClick = (item) => {
    if (item.type === 'schematic') {
      navigate(`/front-schematics/${item.id}`);
    } else {
      navigate(`/front-components/${item.id}`);
    }
  };

  const handleClose = () => clearSearch();

  return (
    <Box sx={{
      position: 'relative', right: 48, zIndex: 1301,
      bgcolor: 'rgba(8, 39, 59, 0.95)', width: { xs: '280px', sm: 380 },
      maxHeight: 320, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(70px)',
      borderRadius: '0 0 16px 16px', overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.2)', borderTop: 'none',
      overflowY: 'auto', overflowX: 'hidden'
    }}>
      <IconButton onClick={handleClose} size="small" sx={{
        position: 'absolute', top: 8, right: 8, zIndex: 2, color: 'text.primary',
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)', transform: 'scale(1.1)' }
      }}>
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Результати ({searchResults.length})
        </Typography>
        {isSearching && (
          <Typography variant="caption" color="text.secondary">
            Шукаємо...
          </Typography>
        )}
      </Box>

      {schematics.length > 0 && (
        <Box sx={{ px: 1.5, pb: 0.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: 'text.primary' }}>
            Схеми ({schematics.length})
          </Typography>
          {schematics.slice(0, 4).map(item => (
            <Box key={item.id} onClick={() => handleItemClick(item)} sx={{
              display: 'flex', alignItems: 'center', gap: 1, p: 1.25,
              cursor: 'pointer', transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'translateX(4px)' }
            }}>
              <IconButton size="small" sx={{ p: 0.5 }}>
                <SchematicIcon />
              </IconButton>
              <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1 }}>
                {item.title || item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {components.length > 0 && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, color: 'text.primary' }}>
            Компоненти ({components.length})
          </Typography>
          {components.slice(0, 4).map(item => (
            <Box key={item.id} onClick={() => handleItemClick(item)} sx={{
              display: 'flex', alignItems: 'center', gap: 1, p: 1.25,
              cursor: 'pointer', transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)', transform: 'translateX(4px)' }
            }}>
              <IconButton size="small" sx={{ p: 0.5 }}>
                <ComponentIcon />
              </IconButton>
              <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1 }}>
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {(!schematics.length && !components.length) && (
        <Box sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isSearching ? 'Шукаємо...' : 'Нічого не знайдено'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchResults;

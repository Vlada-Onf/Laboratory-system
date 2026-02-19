import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Folder as SchematicIcon,
  Settings as ComponentIcon,
  SearchOff as ClearIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSearchStore } from '../../store/useSearchStore';

const DRAWER_WIDTH = 240;

const SearchResults = ({ results }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearSearch = useSearchStore(state => state.clearSearch);
  const isSearching = useSearchStore(state => state.isSearching);
  const wasNavigation = useRef(false);

  useEffect(() => {
    if (wasNavigation.current && isSearching) {
      clearSearch();
      wasNavigation.current = false;
    }
  }, [location.pathname, isSearching, clearSearch]);

  const schematics = results.filter(item => item.type === 'schematic');
  const components = results.filter(item => item.type === 'component');

  const handleItemClick = (item) => {
    wasNavigation.current = true;
    
    if (item.type === 'schematic') {
      navigate(`/front-schematics/${item.id}`);
    } else if (item.type === 'component') {
      navigate(`/front-components/${item.id}`);
    }
  };

  const handleCloseResults = () => {
    clearSearch();
  };

  const getItemIcon = (type) => {
    return type === 'schematic' ? <SchematicIcon /> : <ComponentIcon />;
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'relative',
        mb: 3,
        maxHeight: '400px',
        overflow: 'auto',
        borderRadius: 2,
        ml: `${DRAWER_WIDTH}px`,
        mx: 'auto',
        maxWidth: '1200px',
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        bgcolor: 'background.paper',
      }}
    >
      <IconButton
        onClick={handleCloseResults}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'grey.200' }
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Результати пошуку
          </Typography>
          <Chip 
            label={`${results.length}`} 
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider />

      {schematics.length > 0 && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="subtitle2"  sx={{ mb: 1 }}>
            Схеми ({schematics.length})
          </Typography>
          {schematics.map((sch) => (
            <Box
              key={sch.id}
              onClick={() => handleItemClick(sch)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
  bgcolor: 'rgba(255, 255, 255, 0.08)',
  transform: 'translateX(4px)',
  boxShadow: 1,
},
              }}
            >
              <IconButton size="small" edge="start">
                {getItemIcon('schematic')}
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body1" fontWeight={500} noWrap>
        {sch.title}
      </Typography>
      {sch.description && (
        <Typography variant="body2" color="text.secondary" noWrap>
          {sch.description}
        </Typography>
      )}
    </Box>
            </Box>
          ))}
        </Box>
      )}

      {components.length > 0 && (
        <>
          <Divider />
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle2"  sx={{ mb: 1 }}>
              Компоненти ({components.length})
            </Typography>
            {components.map((comp) => (
              <Box
                key={comp.id}
                onClick={() => handleItemClick(comp)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
  bgcolor: 'rgba(255, 255, 255, 0.08)',
  transform: 'translateX(4px)',
  boxShadow: 1,
},
                }}
              >
                <IconButton size="small" edge="start">
                  {getItemIcon('component')}
                </IconButton>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={500} noWrap>
                    {comp.name}
                  </Typography>
                  {comp.description && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {comp.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {schematics.length === 0 && components.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <ClearIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Нічого не знайдено
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SearchResults;

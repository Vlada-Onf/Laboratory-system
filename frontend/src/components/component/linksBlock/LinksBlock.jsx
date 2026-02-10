import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinksRow from './LinksRow';
import LinksEditModal from './LinkEditModal';
import { useTheme } from '@mui/material';

const LinksBlock = ({ component, onUpdateLinks }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
const theme = useTheme();
const isDarkMode = theme.palette.mode === 'dark';

  if (!component){
    return null;
  }

  const links = {
    docLink: component.docLink,
    buyLink: component.buyLink,
    otherLinks: component.otherLinks || [],
  };

  const handleSaveLinks = (updatedLinks) => {
    onUpdateLinks(updatedLinks);
    setEditModalOpen(false);
  };

  return (
    <Box sx={{ position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' }}>
      <Tooltip title="Редагувати посилання">
        <IconButton
  onClick={() => setEditModalOpen(true)}
  sx={{
    position: 'absolute',
    top: 12,
    right: 12,

    bgcolor: 'primary.main',
    color: 'white',

    width: 34,
    height: 34,
    borderRadius: '50%',

    border: isDarkMode
      ? '2px solid rgba(255,255,255,0.9)'
      : '2px solid transparent',

    transition: 'all 0.2s ease',

    '&:hover': {
      bgcolor: 'primary.dark',
      transform: 'scale(1.1)',
      boxShadow: 4,
      border: isDarkMode
        ? '1px solid white'
        : '1px solid transparent',
    },

    '&:active': {
      transform: 'scale(0.95)'
    }
  }}
>
  <EditIcon sx={{ fontSize: 18 }} />
</IconButton>


      </Tooltip>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, pt: 3 }}>
  {component.docLink && (
    <LinksRow title="Документація" links={[component.docLink]} color="#76bff4" />
  )}
  {component.buyLink && (
    <LinksRow title="Купити" links={[component.buyLink]} color="#5bc522" />
  )}
  {component.otherLinks?.length > 0 && (
    <LinksRow title="Інші посилання" links={component.otherLinks} color="#f16731" />
  )}

  {!component.docLink && !component.buyLink && (!component.otherLinks || component.otherLinks.length === 0) && (
    <Box sx={{ color: 'text.secondary', fontStyle: 'italic', p: 1 }}>
      Додайте інформацію про посилання
    </Box>
  )}
</Box>

      <LinksEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        links={links}
        onSave={handleSaveLinks}
      />
    </Box>
  );
};

export default LinksBlock;

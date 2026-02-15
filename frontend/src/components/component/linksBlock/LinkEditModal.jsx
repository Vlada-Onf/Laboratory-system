import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Box, Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useUsefulLinksStore } from '../../../store/useUsefulLinksStore';

const LinkEditModal = ({ open, onClose, componentId, usefulLinks = [] }) => {
 
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  const { addUsefulLink, updateUsefulLink, deleteUsefulLink } = useUsefulLinksStore();

  const handleAddLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    
    try {
      await addUsefulLink({
        componentId,
        title: newLinkTitle,
        url: newLinkUrl
      });
      
      setNewLinkTitle('');
      setNewLinkUrl('');
    } catch (error) {
      console.error('Помилка додавання лінка:', error);
    }
  };

  const handleUpdateLink = async (linkId, title, url) => {
    try {
      await updateUsefulLink(linkId, { title, url });
    } catch (error) {
      console.error('Помилка оновлення лінка:', error);
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await deleteUsefulLink(linkId);
    } catch (error) {
      console.error('Помилка видалення лінка:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Корисні посилання
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
            <TextField
              label="Введіть назву"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Введіть посилання"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              size="small"
              fullWidth
            />
            <IconButton
              onClick={handleAddLink}
              disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
              sx={{ alignSelf: 'end', height: '40px', width: '40px' }}
            >
              <AddCircleIcon />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {usefulLinks.map((link) => (
              <Box key={link.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1 }}>
                <TextField
                  value={link.title}
                  onChange={(e) => handleUpdateLink(link.id, e.target.value, link.url)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={link.url}
                  onChange={(e) => handleUpdateLink(link.id, link.title, e.target.value)}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <IconButton
                  onClick={() => handleDeleteLink(link.id)}
                  size="small"
                  color="error"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkEditModal;

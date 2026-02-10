import React, { useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, Box, IconButton, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const LinksEditModal = ({
  open,
  onClose,
  links,
  onSave,
  title = "Редагувати інформацію про посилання"
}) => {
  const [form, setForm] = useState({
    docLink: links.docLink || '',
    buyLink: links.buyLink || '',
    otherLinksInput: '',
  });
  const [otherLinks, setOtherLinks] = useState(links.otherLinks || []);

  const handleInputChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const addOtherLink = useCallback(() => {
    const newLink = form.otherLinksInput?.trim();
    if (newLink && !otherLinks.includes(newLink)) {
      setOtherLinks(prev => [...prev, newLink]);
      setForm(prev => ({ ...prev, otherLinksInput: '' }));
    }
  }, [form.otherLinksInput, otherLinks]);

  const removeOtherLink = useCallback((linkToRemove) => {
    setOtherLinks(prev => prev.filter(link => link !== linkToRemove));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOtherLink();
    }
  }, [addOtherLink]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSave({
      docLink: form.docLink || null,
      buyLink: form.buyLink || null,
      otherLinks: otherLinks,
    });
    onClose();
  }, [form, otherLinks, onSave, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Документація
              </Typography>
              <TextField
                value={form.docLink}
                onChange={handleInputChange('docLink')}
                placeholder="Введіть посилання"
                fullWidth
                InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Магазин
              </Typography>
              <TextField
                value={form.buyLink}
                onChange={handleInputChange('buyLink')}
                placeholder="Введіть посилання"
                fullWidth
                InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} /> }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Інші посилання
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  value={form.otherLinksInput}
                  onChange={handleInputChange('otherLinksInput')}
                  onKeyPress={handleKeyPress}
                  placeholder="Введіть посилання"
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                />
                <IconButton
                  onClick={addOtherLink}
                  sx={{
                    alignSelf: 'flex-end',
                    height: '40px',
                    width: '40px',
                    p: 0
                  }}
                  disabled={!form.otherLinksInput?.trim()}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {otherLinks.map((link, index) => (
                  <Chip
                    key={`${link}-${index}`}
                    label={link.slice(0, 30) + (link.length > 30 ? '...' : '')}
                    onDelete={() => removeOtherLink(link)}
                    size="small"
                    sx={{ maxWidth: 200 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="contained">Зберегти</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LinksEditModal;

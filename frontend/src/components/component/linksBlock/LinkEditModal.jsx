import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLinkModal } from '../../../hooks/links/useLinkModal';
import LinkForm from './LinkForm';
import LinkList from './LinkList';

const LinkEditModal = ({ open, onClose, componentId, usefulLinks = [] }) => {
  const {
    newLinkTitle, newLinkUrl, setNewLinkTitle, setNewLinkUrl,
    handleAddLink, handleUpdateLink, handleDeleteLink, isAddDisabled
  } = useLinkModal(componentId);

  const handleTitleChange = (e) => setNewLinkTitle(e.target.value);
  const handleUrlChange = (e) => setNewLinkUrl(e.target.value);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Корисні посилання
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <LinkForm
            newLinkTitle={newLinkTitle}
            newLinkUrl={newLinkUrl}
            onTitleChange={handleTitleChange}
            onUrlChange={handleUrlChange}
            onAdd={handleAddLink}
            disabled={isAddDisabled}
          />
          <LinkList
            usefulLinks={usefulLinks}
            onUpdate={handleUpdateLink}
            onDelete={handleDeleteLink}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(LinkEditModal);

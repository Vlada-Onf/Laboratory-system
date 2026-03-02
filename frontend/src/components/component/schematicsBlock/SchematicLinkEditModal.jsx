import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSchematicLinkModal } from '../../../hooks/schematics/useSchematicLinkModal';
import LinkForm from './../linksBlock/LinkForm';
import LinkList from './../linksBlock/LinkList';

const SchematicLinkEditModal = ({ open, onClose, schematicId, schematicLinks = [] }) => {
  const {
    newLinkTitle, newLinkUrl, setNewLinkTitle, setNewLinkUrl,
    handleAddLink, handleUpdateLink, handleDeleteLink, isAddDisabled
  } = useSchematicLinkModal(schematicId);

  const handleTitleChange = (e) => setNewLinkTitle(e.target.value);
  const handleUrlChange = (e) => setNewLinkUrl(e.target.value);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Корисні посилання (схема)
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
            usefulLinks={schematicLinks}
            onUpdate={handleUpdateLink}
            onDelete={handleDeleteLink}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(SchematicLinkEditModal);

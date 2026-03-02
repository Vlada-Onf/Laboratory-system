import { useState, useCallback } from 'react';
import { useUsefulLinksStore } from '@store/useUsefulLinksStore';

export const useLinkModal = (componentId) => {
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const { addUsefulLink, updateUsefulLink, deleteUsefulLink } = useUsefulLinksStore();

  const handleAddLink = useCallback(async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()){
      return;
    }
    try {
      await addUsefulLink({ componentId, title: newLinkTitle, url: newLinkUrl });
      setNewLinkTitle('');
      setNewLinkUrl('');
    } catch (error) {
      console.error('Помилка додавання:', error);
    }
  }, [newLinkTitle, newLinkUrl, componentId, addUsefulLink]);

  const handleUpdateLink = useCallback(async (linkId, title, url) => {
    try {
      await updateUsefulLink(linkId, { title, url });
    } catch (error) {
      console.error('Помилка оновлення:', error);
    }
  }, [updateUsefulLink]);

  const handleDeleteLink = useCallback(async (linkId) => {
    try {
      await deleteUsefulLink(linkId);
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  }, [deleteUsefulLink]);

  const isAddDisabled = !newLinkTitle.trim() || !newLinkUrl.trim();

  return {
    newLinkTitle,
    newLinkUrl,
    setNewLinkTitle,
    setNewLinkUrl,
    handleAddLink,
    handleUpdateLink,
    handleDeleteLink,
    isAddDisabled
  };
};

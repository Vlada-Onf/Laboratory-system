import { useState, useCallback } from 'react';
import { useSchematicLinksStore } from '@store/useSchematicLinksStore';

export const useSchematicLinkModal = (schematicId) => {
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const {
    addSchematicLink,
    updateSchematicLink,
    deleteSchematicLink,
    fetchSchematicLinks
  } = useSchematicLinksStore();

  const handleAddLink = useCallback(async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !schematicId) {
      console.error('Заповніть всі поля та перевірте schematicId:', schematicId);
      return;
    }

    try {
      await addSchematicLink({
        schematicId: schematicId,
        title: newLinkTitle,
        url: newLinkUrl
      });

      await fetchSchematicLinks(schematicId);

      setNewLinkTitle('');
      setNewLinkUrl('');

    } catch (error) {
      console.error('Помилка додавання посилання схеми:', error);
    }
  }, [newLinkTitle, newLinkUrl, schematicId, addSchematicLink, fetchSchematicLinks]);

  const handleUpdateLink = useCallback(async (linkId, title, url) => {
    if (!linkId || !title?.trim() || !url?.trim()) {
      console.error('Немає даних для оновлення');
      return;
    }

    try {
      await updateSchematicLink(linkId, { title, url });

      if (schematicId) {
        await fetchSchematicLinks(schematicId);
      }

    } catch (error) {
      console.error('Помилка оновлення:', error);
    }
  }, [updateSchematicLink, fetchSchematicLinks, schematicId]);

  const handleDeleteLink = useCallback(async (linkId) => {
    if (!linkId) {
      console.error('Немає linkId для видалення');
      return;
    }

    try {
      await deleteSchematicLink(linkId);

      if (schematicId) {
        await fetchSchematicLinks(schematicId);
      }

    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  }, [deleteSchematicLink, fetchSchematicLinks, schematicId]);

  const isAddDisabled = !newLinkTitle.trim() || !newLinkUrl.trim() || !schematicId;

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

import { useState, useCallback } from 'react';

export const useCategoryCardActions = ({
  id,
  name,
  description,
  cardColor,
  onEditCategory,
  onDeleteCategory,
  onCategoryClick
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handleEditClose = useCallback(() => setEditOpen(false), []);

  const handleMenuButtonEvents = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const handleMenuClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCardClick = useCallback(() => {
    if (open) {
      handleMenuClose();
      return;
    }
    onCategoryClick?.(id);
  }, [id, onCategoryClick, open, handleMenuClose]);

  const handleEdit = useCallback((event) => {
    event?.stopPropagation();
    handleMenuClose();
    setEditOpen(true);
  }, [handleMenuClose]);

  const handleEditSubmit = useCallback((updatedCategory) => {
    const dataForStore = {
      name: updatedCategory.name || name,
      description: updatedCategory.description || description,
      photo: updatedCategory.photo,
      cardColor: updatedCategory.cardColor || cardColor
    };
    onEditCategory(id, dataForStore);
    handleEditClose();
  }, [id, name, description, cardColor, onEditCategory, handleEditClose]);

  const handleDelete = useCallback((event) => {
    event?.stopPropagation();
    handleMenuClose();
    onDeleteCategory?.(id);
  }, [id, onDeleteCategory, handleMenuClose]);

  return {
    anchorEl,
    editOpen,
    open,
    handleCardClick,
    handleMenuClick,
    handleMenuButtonEvents,
    handleMenuClose,
    handleEdit,
    handleDelete,
    handleEditSubmit,
    handleEditClose
  };
};

import { useState, useCallback } from 'react';

export const useSchematicMenu = (onEdit, onDelete, id, title, schematic) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleEdit = useCallback(() => {
    handleMenuClose();
    onEdit?.(schematic);
  }, [handleMenuClose, onEdit, schematic]);

  const handleDelete = useCallback(() => {
    handleMenuClose();
    onDelete?.(id, title);
  }, [handleMenuClose, onDelete, id, title]);

  return {
    anchorEl,
    open,
    handleMenuClick,
    handleMenuClose,
    handleEdit,
    handleDelete
  };
};

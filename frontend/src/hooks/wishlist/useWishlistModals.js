import { useState, useCallback } from 'react';
import { useWishlistStore } from '@store/useWishlistStore';
import { useWishlistStatusesStore } from '@store/useWishlistStatusesStore';

export const useWishlistModals = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusWishlistId, setStatusWishlistId] = useState(null);
  const [currentStatusId, setCurrentStatusId] = useState(null);
  const [newStatusId, setNewStatusId] = useState(null);
  const [completionReason, setCompletionReason] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const { statuses } = useWishlistStatusesStore();

  const openDeleteModal = useCallback((id, name) => {
    setDeleteRowId(id);
    setSelectedRow({ name });
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteRowId(null);
    setSelectedRow(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const currentDeleteRowId = deleteRowId;
    if (currentDeleteRowId) {
      try {
        await useWishlistStore.getState().deleteWishlist(currentDeleteRowId);
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    closeDeleteModal();
  }, [deleteRowId, closeDeleteModal]);

  const openAddModal = useCallback((row) => {
    setSelectedRow(row || { id: 'new', name: 'Новий запис' });
    setAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModalOpen(false);
    setSelectedRow(null);
  }, []);

  const openStatusModalHandler = useCallback((wishlistId, statusId) => {
    setStatusWishlistId(wishlistId);
    setCurrentStatusId(statusId);
    setNewStatusId(statusId);
    setCompletionReason('');
    setIsSavingStatus(false);
    setStatusModalOpen(true);
  }, []);

  const closeStatusModal = useCallback(() => {
    setStatusModalOpen(false);
    setStatusWishlistId(null);
    setCurrentStatusId(null);
    setNewStatusId(null);
    setCompletionReason('');
    setIsSavingStatus(false);
  }, []);

  const handleStatusSubmit = useCallback(async () => {
    if (!statusWishlistId || newStatusId === currentStatusId) {
      closeStatusModal();
      return;
    }
    setIsSavingStatus(true);
    try {
      await useWishlistStore.getState().updateWishlistStatus(
        statusWishlistId, newStatusId, completionReason
      );
      closeStatusModal();
    } catch (error) {
      console.error('Помилка статусу:', error);
    } finally {
      setIsSavingStatus(false);
    }
  }, [statusWishlistId, newStatusId, currentStatusId, completionReason, closeStatusModal]);

  return {
    addModal: { open: addModalOpen, selectedRow },
    openAddModal,
    closeAddModal,
    
    deleteModal: { open: deleteModalOpen, deleteRowId, selectedRow },
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    
    statusModal: {
      open: statusModalOpen,
      statusWishlistId,
      currentStatusId,
      newStatusId,
      completionReason,
      isSavingStatus,
      statuses
    },
    openStatusModalHandler,
    closeStatusModal,
    handleStatusSubmit,
    updateStatusField: useCallback((field, value) => {
      if (field === 'newStatusId'){
        setNewStatusId(value);
      }
      if (field === 'completionReason'){
        setCompletionReason(value);
      }
    }, [])
  };
};

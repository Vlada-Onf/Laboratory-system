import { useState, useCallback } from 'react';
import { useNeedsStore } from '@store/useNeedsStore';
import { useNeedStatusesStore } from '@store/useNeedStatusesStore';
import { useNeedImportancesStore } from '@store/useNeedImportancesStore';

const USER_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

export const useNeedsModals = () => {

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createComponent, setCreateComponent] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNeed, setEditNeed] = useState(null);

  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [priorityNeedId, setPriorityNeedId] = useState(null);
  const [currentPriorityId, setCurrentPriorityId] = useState(null);
  const [newPriorityId, setNewPriorityId] = useState(null);
  const [priorityCompletionReason, setPriorityCompletionReason] = useState('');
  const [isSavingPriority, setIsSavingPriority] = useState(false);

  const { fetchNeeds, deleteNeed, createNeed, updateNeedDetails } = useNeedsStore();
  const { statuses } = useNeedStatusesStore();
  const { importances } = useNeedImportancesStore();

  const openDeleteModal = useCallback((id, row) => {
    setDeleteRowId(id);
    setSelectedRow(row);
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
        await deleteNeed(currentDeleteRowId);
      } catch (error) {
        console.error('Помилка видалення:', error);
      }
    }
    closeDeleteModal();
    await fetchNeeds();
  }, [deleteRowId, deleteNeed, closeDeleteModal, fetchNeeds]);

  const openCreateModal = useCallback((componentRow) => {

    if (!componentRow?.componentId) {
      console.error('openCreateModal: componentId відсутній!', componentRow);
      alert('Помилка: componentId відсутній');
      return;
    }

    setCreateComponent(componentRow);
    setCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
    setCreateComponent(null);
  }, []);

  const handleCreateSubmit = useCallback(async (formData) => {
    try {
      if (!createComponent?.componentId) {
        throw new Error('componentId відсутній!');
      }

      const payload = {
        componentId: createComponent.componentId,
        quantityNeeded: Number(formData.quantityNeeded) || 0,
        description: formData.description || '',
        statusId: formData.statusId,
        importanceId: formData.importanceId,
        requestedBy: USER_ID,
        performedBy: USER_ID,
      };
      await createNeed(payload);
      closeCreateModal();
      await fetchNeeds();
    } catch (error) {
      alert(`Помилка створення: ${error.response?.data?.title || error.message}`);
    }
  }, [createComponent, createNeed, closeCreateModal, fetchNeeds]);

  const openEditModal = useCallback((needRow) => {
    if (!needRow?.id) {
      console.error('openEditModal: need.id відсутній!', needRow);
      return;
    }

    setEditNeed(needRow);
    setEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditNeed(null);
  }, []);

  const handleEditSubmit = useCallback(async (formData) => {
    try {
      if (!editNeed?.id) {
        throw new Error('ID потреби відсутній');
      }
      const payload = {
        id: editNeed.id,
        quantityNeeded: Number(formData.quantityNeeded) || 0,
        description: formData.description || '',
        importanceId: formData.importanceId,
        statusId: formData.statusId,
        performedBy: USER_ID,
        completionReason: formData.completionReason || '',
      };

      await updateNeedDetails(editNeed.id, payload);
      closeEditModal();
      await fetchNeeds();

    } catch (error) {
      alert(`Помилка редагування: ${error.response?.data?.title || error.message}`);
    }
  }, [editNeed, updateNeedDetails, closeEditModal, fetchNeeds]);

  const openPriorityModalHandler = useCallback((needId, priorityId) => {
    setPriorityNeedId(needId);
    setCurrentPriorityId(priorityId);
    setNewPriorityId(priorityId);
    setPriorityCompletionReason('');
    setIsSavingPriority(false);
    setPriorityModalOpen(true);
  }, []);

  const closePriorityModal = useCallback(() => {
    setPriorityModalOpen(false);
    setPriorityNeedId(null);
    setCurrentPriorityId(null);
    setNewPriorityId(null);
    setPriorityCompletionReason('');
    setIsSavingPriority(false);
  }, []);

  const handlePrioritySubmit = useCallback(async () => {
    if (!priorityNeedId || newPriorityId === currentPriorityId) {
      closePriorityModal();
      return;
    }
    setIsSavingPriority(true);
    try {
      await useNeedImportancesStore.getState().updateNeedImportance(
        priorityNeedId,
        newPriorityId,
        priorityCompletionReason
      );
      closePriorityModal();
      await fetchNeeds();
    } catch (error) {
      console.error('Помилка пріоритету:', error);
    } finally {
      setIsSavingPriority(false);
    }
  }, [priorityNeedId, newPriorityId, currentPriorityId, priorityCompletionReason, closePriorityModal, fetchNeeds]);

  const updatePriorityField = useCallback((field, value) => {
    if (field === 'newPriorityId') {
      setNewPriorityId(value);
    }
    if (field === 'completionReason') {
      setPriorityCompletionReason(value);
    }
  }, []);
  return {
    createModal: {
      open: createModalOpen,
      component: createComponent
    },
    openCreateModal,
    closeCreateModal,
    handleCreateSubmit,

    editModal: {
      open: editModalOpen,
      need: editNeed
    },
    openEditModal,
    closeEditModal,
    handleEditSubmit,

    deleteModal: {
      open: deleteModalOpen,
      deleteRowId,
      selectedRow
    },
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,

    priorityModal: {
      open: priorityModalOpen,
      priorityNeedId,
      currentPriorityId,
      newPriorityId,
      completionReason: priorityCompletionReason,
      isSavingPriority,
      importances
    },
    openPriorityModalHandler,
    closePriorityModal,
    handlePrioritySubmit,
    updatePriorityField,

    statuses
  };
};

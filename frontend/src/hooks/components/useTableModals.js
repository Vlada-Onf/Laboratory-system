import { useState, useCallback } from 'react';

export const useTableModals = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  const [paginationModel, setPaginationModel] = useState({ 
    page: 0, 
    pageSize: 5 
  });

  const handleOpenModal = useCallback((row) => {
    setSelectedRow(row);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRow(null);
  }, []);

  const handleDeleteClick = useCallback((row) => {
    setComponentToDelete(row);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setComponentToDelete(null);
  }, []);

  return {
    openModal,
    selectedRow,
    handleOpenModal,
    handleCloseModal,
    
    deleteModalOpen,
    componentToDelete,
    handleDeleteClick,
    handleCloseDeleteModal,
    
    paginationModel,
    setPaginationModel
  };
};

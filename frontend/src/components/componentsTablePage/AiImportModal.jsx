import React, { useState, useEffect } from 'react';
import { Modal, Box, Divider, Stack, Typography, IconButton, Alert, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAiImportStore } from '@/store/useAiImportStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useComponentsStore } from '@store/useComponentsStore';
import AddCategoryModal from '../categories/AddCategoryModal';
import mainPlaceholderSvg from '@/assets/main.svg';
import UploadZone from './UploadZone';
import PreviewSidebar from './PreviewSidebar';
import ScannedItemCard from './ScannedItemCard';

const AiImportModal = ({ open, onClose }) => {
  const {
    analyzeImage,
    scannedItems,
    updateScannedItemField,
    removeScannedItem,
    clearStore,
    isLoading: isAiLoading,
    error: storeError
  } = useAiImportStore();

  const {
    categories,
    fetchCategories,
    addCategory,
    isLoading: isCategoriesLoading
  } = useCategoriesStore();

  const { addComponent, fetchComponents } = useComponentsStore();

  const [_file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [itemCategories, setItemCategories] = useState({});
  const [itemImages, setItemImages] = useState({}); 

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    if (open && categories.length === 0) {
      fetchCategories();
    }
  }, [open, categories.length, fetchCategories]);

  const revokeAllLocalUrls = () => {
    if (preview) URL.revokeObjectURL(preview);
  };

  const handleFullClose = () => {
    revokeAllLocalUrls();
    setFile(null);
    setPreview(null);
    setLocalError(null);
    setItemCategories({});
    setItemImages({});
    clearStore();
    onClose();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setLocalError("Файл занадто великий. Оберіть файл до 5МБ.");
        return;
      }
      setFile(selectedFile);
      setLocalError(null);

      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(selectedFile);
      }

      try {
        const resultItems = await analyzeImage(selectedFile);
        if (resultItems && Array.isArray(resultItems)) {
          resultItems.forEach((item, index) => {
            const descriptionParts = [];

            if (item.description?.trim()) descriptionParts.push(item.description.trim());

            if (item.model) descriptionParts.push(`Модель: ${item.model}`);
            if (item.inventoryNumber) descriptionParts.push(`Інв. номер: ${item.inventoryNumber}`);
            if (item.serialNumber) descriptionParts.push(`Серійний номер: ${item.serialNumber}`);
            if (item.state) descriptionParts.push(`Стан: ${item.state}`);
            if (item.location) descriptionParts.push(`Локація: ${item.location}`);
            if (item.notes) descriptionParts.push(`Нотатки: ${item.notes}`);

            const initialDescription = descriptionParts.join('\n');

            updateScannedItemField(index, 'description', initialDescription);

            if (item.price) updateScannedItemField(index, 'price', item.price);
            if (item.quantity) updateScannedItemField(index, 'quantity', item.quantity);
          });
        }
      } catch (err) {
        console.error("Помилка при аналізі файлу:", err);
      }
    }
  };

  const handleItemFileChange = (index, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setLocalError(`Фото для об'єкта №${index + 1} занадто велике (макс. 5МБ).`);
        return;
      }
      setItemImages(prev => ({ ...prev, [index]: selectedFile }));
    }
  };

  const handleRemoveItemFile = (index) => {
    setItemImages(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleRemoveComponentCard = (indexToRemove) => {
    if (typeof removeScannedItem !== 'function') {
      setLocalError("Метод removeScannedItem не знайдено в сторі.");
      return;
    }
    removeScannedItem(indexToRemove);

    const updateFilterState = (prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        const idx = parseInt(key, 10);
        if (idx < indexToRemove) updated[idx] = prev[idx];
        if (idx > indexToRemove) updated[idx - 1] = prev[idx];
      });
      return updated;
    };

    setItemImages(prev => updateFilterState(prev));
    setItemCategories(prev => updateFilterState(prev));
  };

  const handleCategoryChange = (index, value) => {
    setItemCategories(prev => ({ ...prev, [index]: value }));
  };

  const handleTriggerCreateCategory = (index) => {
    setActiveItemIndex(index);
    setIsAddCategoryOpen(true);
  };

  const handleAddCategorySubmit = async (categoryData) => {
    setIsCreatingCategory(true);
    try {
      const newCat = await addCategory(categoryData);
      if (newCat && activeItemIndex !== null) {
        handleCategoryChange(activeItemIndex, newCat.id);
      }
    } catch (err) {
      setLocalError(`Не вдалося створити нову категорію.${err}`);
    } finally {
      setIsCreatingCategory(false);
      setIsAddCategoryOpen(false);
      setActiveItemIndex(null);
    }
  };

  const getPlaceholderFile = async () => {
    try {
      const response = await fetch(mainPlaceholderSvg);
      const blob = await response.blob();
      return new File([blob], "main-placeholder.svg", { type: "image/svg+xml" });
    } catch (error) {
      return new File([""], "placeholder.jpg", { type: "image/jpeg" }, { error });
    }
  };

  const handleSave = async () => {
    if (!scannedItems || scannedItems.length === 0) {
      setLocalError("Немає розпізнаних компонентів для збереження.");
      return;
    }
    if (scannedItems.some(item => !item.name?.trim())) {
      setLocalError("Назва є обов'язковою для всіх розпізнаних компонентів!");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const defaultPlaceholderFile = await getPlaceholderFile();

      for (let i = 0; i < scannedItems.length; i++) {
        const targetCategoryId = itemCategories[i] || categories[0]?.id;
        const currentItem = scannedItems[i];

        if (!targetCategoryId) {
          throw new Error(`Не обрано категорію для об'єкта №${i + 1}`);
        }

        const componentFields = {
          categoryId: targetCategoryId,
          name: currentItem.name || "",
          description: currentItem.description || "", 
          quantity: currentItem.quantity ? String(currentItem.quantity) : "",
          price: currentItem.price ? String(currentItem.price) : "",
          supplierLink: currentItem.supplierLink || "",
          documentationLink: currentItem.documentationLink || "",
          tagIds: []
        };

        const imageFile = itemImages[i] instanceof File ? itemImages[i] : defaultPlaceholderFile;
        await addComponent(componentFields, imageFile);
      }

      await fetchComponents();
      handleFullClose();
    } catch (err) {
      const errorText = err.response?.data?.message || err.message || "Помилка при збереженні.";
      setLocalError(`Помилка: ${errorText}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentError = localError || storeError;
  const isAnyLoading = isAiLoading || isSaving || isCreatingCategory;

  return (
    <>
      <Modal open={open} onClose={handleFullClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          width: '100vw', height: '100vh', bgcolor: 'background.paper', p: { xs: 2, md: 4 },
          display: 'flex', flexDirection: 'column', outline: 'none', overflow: 'hidden'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AutoAwesomeIcon sx={{ color: '#6a11cb', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="700">AI Імпорт компонентів</Typography>
            </Box>
            <IconButton onClick={handleFullClose} size="large" disabled={isAnyLoading}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />
          {currentError && <Alert severity="error" sx={{ mb: 2 }}>{currentError}</Alert>}

          {!preview ? (
            <UploadZone onFileChange={handleFileChange} />
          ) : (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ flex: 1, minHeight: 0, mb: 2 }}>

              <PreviewSidebar
                preview={preview}
                isAnyLoading={isAnyLoading}
                isSaving={isSaving}
                isCreatingCategory={isCreatingCategory}
              />

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Box sx={{ flex: 1, overflowY: 'auto', pr: { xs: 0, md: 1 }, mb: 2 }}>
                  <Stack spacing={3}>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Знайдено компонентів: {scannedItems?.length || 0}
                    </Typography>

                    {scannedItems?.map((item, index) => (
                      <ScannedItemCard
                        key={index}
                        item={item}
                        index={index}
                        categories={categories}
                        isCategoriesLoading={isCategoriesLoading}
                        isAnyLoading={isAnyLoading}
                        currentCategoryId={itemCategories[index] || categories[0]?.id || ''}
                        itemImage={itemImages[index]}
                        onRemoveCard={handleRemoveComponentCard}
                        onItemFileChange={handleItemFileChange}
                        onRemoveItemFile={handleRemoveItemFile}
                        onCategoryChange={handleCategoryChange}
                        onTriggerCreateCategory={handleTriggerCreateCategory}
                        onFieldChange={updateScannedItemField}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ pt: 1, display: 'flex', gap: 2, bgcolor: 'background.paper' }}>
                  <Button size="large" fullWidth variant="outlined" onClick={handleFullClose} disabled={isAnyLoading} sx={{
                    fontSize: 16, height: 50, minWidth: 120, color: '#fff',
                    background: 'linear-gradient(135deg, #08273b, #365468)',
                    '&:hover': { background: 'linear-gradient(135deg, #051926, #20314a)' },
                    '&:disabled': { background: 'rgba(8, 39, 59, 0.5)' },
                  }}>
                    Скасувати
                  </Button>
                  <Button
                    size="large" fullWidth variant="contained" onClick={handleSave}
                    disabled={isAnyLoading || !scannedItems || scannedItems.length === 0}
                    sx={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', py: 1.5 }}
                  >
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : `Зберегти всі в таблицю (${scannedItems?.length || 0})`}
                  </Button>
                </Box>
              </Box>

            </Stack>
          )}
        </Box>
      </Modal>

      <AddCategoryModal
        open={isAddCategoryOpen}
        onClose={() => {
          setIsAddCategoryOpen(false);
          setActiveItemIndex(null);
        }}
        onAdd={handleAddCategorySubmit}
      />
    </>
  );
};

export default AiImportModal;
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Button, TextField,
  CircularProgress, IconButton, Divider, Stack,
  MenuItem, Select, FormControl, InputLabel, Alert, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAiImportStore } from '@/store/useAiImportStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useComponentsStore } from '@store/useComponentsStore';

import AddCategoryModal from '../categories/AddCategoryModal';

const AiImportModal = ({ open, onClose }) => {
  const {
    analyzeImage,
    scannedItems,
    updateScannedItemField,
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

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [itemCategories, setItemCategories] = useState({});

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    if (open && categories.length === 0) {
      fetchCategories();
    }
  }, [open, categories.length, fetchCategories]);

  const handleFullClose = () => {
    setFile(null);
    setPreview(null);
    setLocalError(null);
    setItemCategories({});
    clearStore();
    onClose();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setLocalError("Файл занадто великий. Оберіть фото до 5МБ.");
        return;
      }
      setFile(selectedFile);
      setLocalError(null);

      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
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
          });
        }
      } catch (err) {
        console.error("Помилка при аналізі фото:", err);
      }
    }
  };

  const handleCategoryChange = (index, value) => {
    setItemCategories(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleAddCategorySubmit = async (categoryData) => {
    setIsCreatingCategory(true); // Вмикаємо лоадер перед запитом
    try {
      const newCat = await addCategory(categoryData);
      if (newCat && activeItemIndex !== null) {
        handleCategoryChange(activeItemIndex, newCat.id);
      }
    } catch (err) {
      console.error("Помилка при створенні категорії через імпорт:", err);
      setLocalError("Не вдалося створити нову категорію.");
    } finally {
      setIsCreatingCategory(false);
      setIsAddCategoryOpen(false);
      setActiveItemIndex(null);
    }
  };

  const handleSave = async () => {
    if (!scannedItems || scannedItems.length === 0) {
      setLocalError("Немає розпізнаних компонентів для збереження.");
      return;
    }

    const hasEmptyName = scannedItems.some(item => !item.name?.trim());
    if (hasEmptyName) {
      setLocalError("Назва є обов'язковою для всіх розпізнаних компонентів!");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
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

        const imageFile = file instanceof File
          ? file
          : new File([""], "placeholder.jpg", { type: "image/jpeg" });

        await addComponent(componentFields, imageFile);
      }

      await fetchComponents();
      handleFullClose();
    } catch (err) {
      console.error("Помилка при збереженні імпортованих компонентів:", err);
      const errorText = err.response?.data?.message || err.response?.data || err.message || "Помилка при збереженні.";
      setLocalError(`Помилка: ${errorText}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentError = localError || storeError;
  const isAnyLoading = isAiLoading || isSaving || isCreatingCategory;

  return (
    <>
      <Modal
        open={open}
        onClose={handleFullClose}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          overflow: 'hidden'
        }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AutoAwesomeIcon sx={{ color: '#6a11cb', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="700">
                AI Імпорт компонентів
              </Typography>
            </Box>
            <IconButton onClick={handleFullClose} size="large" disabled={isAnyLoading}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {currentError && <Alert severity="error" sx={{ mb: 2 }}>{currentError}</Alert>}

          {!preview ? (
            <Box
              component="label"
              sx={{
                flex: 1,
                border: '2px dashed #e0e0e0',
                borderRadius: 4,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { borderColor: '#f16731' }
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              <CloudUploadIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
              <Typography variant="h5" mb={1}>Завантажте фото компонентів</Typography>
              <Typography variant="body1" color="text.secondary">ШІ розпізнає всі об'єкти на фото, а система додасть їх у таблицю</Typography>
            </Box>
          ) : (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              sx={{ flex: 1, minHeight: 0, mb: 2 }}
            >

              <Box sx={{
                width: { xs: '100%', md: '400px', lg: '500px' },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 240, md: '100%' },
                  maxHeight: { md: 'calc(100vh - 200px)' },
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0'
                }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />

                  {isAnyLoading && (
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      bgcolor: 'rgba(106, 17, 203, 0.4)', backdropFilter: 'blur(3px)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white',
                      zIndex: 10
                    }}>
                      <CircularProgress color="inherit" />
                      <Typography sx={{ mt: 2, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center', px: 2 }}>
                        {isSaving 
                          ? "ЗБЕРЕЖЕННЯ ..."
                          : isCreatingCategory
                            ? "СТВОРЕННЯ КАТЕГОРІЇ..."
                            : "АНАЛІЗУЄМО ..."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
              }}>
                <Box sx={{ flex: 1, overflowY: 'auto', pr: { xs: 0, md: 1 }, mb: 2 }}>
                  <Stack spacing={3}>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Знайдено компонентів: {scannedItems?.length || 0}
                    </Typography>

                    {scannedItems?.map((item, index) => {
                      const currentCategoryId = itemCategories[index] || categories[0]?.id || '';

                      return (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, border: '1px solid #e0e0e0' }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="subtitle1" sx={{ bgcolor: '#6a11cb', color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: '600', fontSize: '0.9rem' }}>
                              Об'єкт №{index + 1}
                            </Typography>
                          </Stack>

                          <Stack spacing={2.5}>
                            <FormControl fullWidth disabled={isAnyLoading || isCategoriesLoading} size="small">
                              <InputLabel>Категорія *</InputLabel>
                              <Select
                                value={currentCategoryId}
                                label="Категорія *"
                                onChange={(e) => handleCategoryChange(index, e.target.value)}
                              >
                                {isCategoriesLoading ? (
                                  <MenuItem disabled value=""><CircularProgress size={16} sx={{ mr: 1 }} /> Завантаження...</MenuItem>
                                ) : categories.length === 0 ? (
                                  <MenuItem disabled value="">Немає доступних категорій</MenuItem>
                                ) : (
                                  categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                  ))
                                )}

                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem
                                  value=""
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setActiveItemIndex(index);
                                    setIsAddCategoryOpen(true);
                                  }}
                                  sx={{
                                    color: '#6a11cb',
                                    fontWeight: '600',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    '&:hover': {
                                      backgroundColor: 'rgba(106, 17, 203, 0.08)'
                                    }
                                  }}
                                >
                                  + Створити нову категорію
                                </MenuItem>
                              </Select>
                            </FormControl>

                            <TextField
                              fullWidth size="small" label="Назва *" value={item.name || ''} 
                              onChange={(e) => updateScannedItemField(index, 'name', e.target.value)}
                              disabled={isAnyLoading} required
                            />

                            <TextField
                              fullWidth multiline rows={4} size="small" label="Опис" value={item.description || ''}
                              onChange={(e) => updateScannedItemField(index, 'description', e.target.value)}
                              disabled={isAnyLoading}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              <TextField
                                label="Ціна (₴)" size="small" fullWidth type="number" placeholder="0" value={item.price || ''}
                                onChange={(e) => updateScannedItemField(index, 'price', e.target.value)} disabled={isAnyLoading}
                              />
                              <TextField
                                label="Кількість" size="small" fullWidth type="number" placeholder="0" value={item.quantity || ''}
                                onChange={(e) => updateScannedItemField(index, 'quantity', e.target.value)} disabled={isAnyLoading}
                              />
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              <TextField
                                label="Посилання на документацію" size="small" fullWidth placeholder="Вставте посилання" value={item.documentationLink || ''}
                                onChange={(e) => updateScannedItemField(index, 'documentationLink', e.target.value)} disabled={isAnyLoading}
                              />
                              <TextField
                                label="Посилання на магазин" size="small" fullWidth placeholder="Вставте посилання" value={item.supplierLink || ''}
                                onChange={(e) => updateScannedItemField(index, 'supplierLink', e.target.value)} disabled={isAnyLoading}
                              />
                            </Stack>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>

                <Box sx={{ pt: 1, display: 'flex', gap: 2, bgcolor: 'background.paper' }}>
                  <Button size="large" fullWidth variant="outlined" onClick={handleFullClose} disabled={isAnyLoading} sx={{
                    fontSize: 16,
                    height: 50,
                    minWidth: 120,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #08273b, #365468)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #051926, #20314a)',
                    },
                    '&:disabled': {
                      background: 'rgba(8, 39, 59, 0.5)',
                    },
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
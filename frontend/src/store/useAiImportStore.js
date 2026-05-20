import { create } from 'zustand';
import apiClient from '../api/client'; 

export const useAiImportStore = create((set, get) => ({
  scannedItems: [],
  isLoading: false,
  error: null,

  analyzeImage: async (file) => { // Назву методу залишив, щоб не ламати імпорти в компонентах
    set({ isLoading: true, error: null });

    if (!file) {
      const errMsg = 'Файл не обрано або порожній.';
      set({ error: errMsg, isLoading: false });
      return;
    }

    // 1. Визначаємо, що це за файл за його MIME-типом
    const isExcelOrCsv = 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.type === 'application/vnd.ms-excel' || 
      file.type === 'text/csv' ||
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls') || 
      file.name.endsWith('.csv');

    // 2. Налаштовуємо параметри залежно від типу файлу
    let endpoint = '/import/analyze-image';
    let formDataKey = 'image';
    const fileName = file.name || (isExcelOrCsv ? 'table.xlsx' : 'image.jpg');

    if (isExcelOrCsv) {
      endpoint = '/import/analyze-excel';
      formDataKey = 'file'; // Свапаємо ключ на "file", як просить swagger для таблиць
    }

    const formData = new FormData();
    formData.append(formDataKey, file, fileName);

    try {
      // 3. Відправляємо запит на динамічно визначений ендпоінт
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      set({ scannedItems: response.data, isLoading: false });
      return response.data;
    } catch (err) {
      console.error("Повний об'єкт помилки (err):", err);

      let errMsg = 'Не вдалося розпізнати файл.';

      if (err.response) {
        console.error("Код статусу від сервера:", err.response.status);
        console.error("Тіло помилки від бекенду (Data):", err.response.data);

        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else {
          errMsg = err.response.data?.message || `Помилка сервера (${err.response.status})`;
        }
      } else if (err.request) {
        errMsg = 'Сервер не зміг обробити файл. Перевірте, чи перевизначився Content-Type.';
      } else {
        errMsg = err.message;
      }

      set({ error: errMsg, isLoading: false });
      throw err;
    }
  },

  importItems: async (categoryId, item, createdBy = "3fa85f64-5717-4562-b3fc-2c963f66afa6") => {
    set({ isLoading: true, error: null });

    const payload = {
      categoryId: categoryId,
      createdBy: createdBy,
      items: [
        {
          name: item.name || "",
          model: item.model || "",
          inventoryNumber: item.inventoryNumber || "",
          serialNumber: item.serialNumber || "",
          state: item.state || "",
          location: item.location || "",
          notes: item.notes || ""
        }
      ]
    };

    try {
      const response = await apiClient.post('/import/import-items', payload);
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      console.error("Статус:", err.response?.status);
      console.error("Текст помилки:", err.response?.data);

      let errMsg = 'Помилка при збереженні в базу.';
      if (err.response) {
        errMsg = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data?.message || `Помилка сервера (${err.response.status})`);
      } else {
        errMsg = err.message;
      }

      set({ error: errMsg, isLoading: false });
      throw err;
    }
  },

  updateScannedItemField: (index, field, value) => {
    const { scannedItems } = get();
    const updated = [...scannedItems];
    updated[index] = { ...updated[index], [field]: value };
    set({ scannedItems: updated });
  },

  removeScannedItem: (indexToRemove) => {
    const { scannedItems } = get();
    const updated = scannedItems.filter((_, index) => index !== indexToRemove);
    set({ scannedItems: updated });
  },

  clearStore: () => set({ scannedItems: [], error: null, isLoading: false })
}));
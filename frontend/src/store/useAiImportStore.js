import { create } from 'zustand';
import apiClient from '../api/client'; 

export const useAiImportStore = create((set, get) => ({
  scannedItems: [],
  isLoading: false,
  error: null,

  analyzeImage: async (file) => {
    set({ isLoading: true, error: null });

    if (!file) {
      const errMsg = 'Файл не обрано або порожній.';
      set({ error: errMsg, isLoading: false });
      return;
    }

    const formData = new FormData();
    const fileName = file.name || 'image.jpg';
    formData.append('image', file, fileName);

    try {
      console.log("Надсилаємо POST запит із перевизначенням дефолтного Content-Type...");
      const response = await apiClient.post('/import/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("=== AI IMPORT: УСПІХ ===");
      console.log("Дані від ШІ (InventoryItemImportDto):", response.data);

      set({ scannedItems: response.data, isLoading: false });
      return response.data;
    } catch (err) {
      console.error("=== AI IMPORT: ПОМИЛКА ЗАПИТУ ===");
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
        console.error("Запит відправлено, відповіді немає (Можливий конфлікт заголовків у проксі Render).");
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

  clearStore: () => set({ scannedItems: [], error: null, isLoading: false })
}));
import React, { useState, useCallback } from 'react';

export const useNeedForm = (initialData) => {
  const [form, setForm] = useState(() => ({
    quantity: initialData?.quantity || 1,
    description: initialData?.description || '',
    importanceId: initialData?.importanceId || '',
    statusId: initialData?.statusId || '',
    completionReason: initialData?.completionReason || '',
  }));

  const handleChange = useCallback((field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  }, []);

  const getPayload = useCallback(() => ({
    quantityNeeded: Number(form.quantity) || 0,
    description: form.description.trim(),
    importanceId: form.importanceId,
    statusId: form.statusId,
    completionReason: form.completionReason.trim(),
    performedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  }), [form]);

  return { form, handleChange, getPayload, setForm };
};
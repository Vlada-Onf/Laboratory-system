import { useState, useCallback } from 'react';

const DEFAULT_REASON_ID = "d1f539e7-c137-42e3-81d9-920b1fb8ecd7";

export const useDamagedForm = (initialData = {}) => {
  const [form, setForm] = useState(() => ({
    quantity: initialData.quantity?.toString() || '1',
    reasonId: initialData.reasonId || DEFAULT_REASON_ID,
    description: initialData.description || ''
  }));

  const handleChange = useCallback((field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);
  const handleReasonChange = useCallback((e) => {
    setForm(prev => ({
      ...prev,
      reasonId: e.target.value
    }));
  }, []);

  const resetForm = useCallback((newInitialData = {}) => {
    setForm({
      quantity: newInitialData.quantity?.toString() || '1',
      reasonId: newInitialData.reasonId || DEFAULT_REASON_ID,
      description: newInitialData.description || ''
    });
  }, []);

  const isValid = form.quantity?.trim() && Number(form.quantity) > 0;

  return {
    form,
    setForm,
    handleChange,
    handleReasonChange,
    resetForm,
    isValid
  };
};

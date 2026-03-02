import { useState, useCallback, useEffect } from 'react';

export const useCategoryForm = (initialValues = {}) => {
  const [form, setForm] = useState({
    name: initialValues.name || initialValues.title || '',
    description: initialValues.description || '',
    photo: null,
    color: initialValues.color || '#08273b',
  });
  const [errors, setErrors] = useState({});

  const reset = useCallback((newInitialData = {}) => {
    setForm({
      name: newInitialData.name || newInitialData.title || '',
      description: newInitialData.description || '',
      photo: null,
      color: newInitialData.color || '#08273b',
    });
    setErrors({});
  }, []);

  useEffect(() => {
    return () => {
      if (form.photo instanceof File) {
        URL.revokeObjectURL(form.photo);
      }
    };
  }, [form.photo]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleColorChange = useCallback((color) => {
    setForm(prev => ({ ...prev, color }));
    setErrors(prev => ({ ...prev, color: '' }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Назва обовʼязкова';
    if (!form.description.trim()) newErrors.description = 'Опис обовʼязковий';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.name, form.description]);

  const isValid = form.name.trim() && form.description.trim();

  return {
    form,
    errors,
    handleChange,
    handleColorChange,
    validate,
    reset,
    isValid
  };
};

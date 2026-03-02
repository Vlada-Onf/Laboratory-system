import { useState, useCallback, useEffect } from 'react';
import { useComponentsStore } from '@store/useComponentsStore';
import { useProfileStore } from '@store/useProfileStore';
import { useSchematicsStore } from '@store/useSchematicsStore';

export const useSchematicModal = ({ schematic, componentId, onClose }) => {
  const { components } = useComponentsStore();
  const { profile } = useProfileStore();
  const { addSchematic, updateSchematic } = useSchematicsStore();
  const isEditing = !!schematic;
  const schematicId = schematic?.id;

  const getComponentName = useCallback((id) => {
    const component = components.find(c => c.id === id);
    return component?.name || `компонент ${id}`;
  }, [components]);

  const getInitialForm = useCallback(() => {
    if (isEditing && schematic) {
      return {
        title: schematic.title || '',
        description: schematic.description || '',
        usefulLinkId: schematic.usefulLinkId || '',
        photo: null,
        document: null,
      };
    }
    return {
      title: '',
      description: '',
      usefulLinkId: '',
      photo: null,
      document: null,
    };
  }, [schematic, isEditing]);

  const [form, setForm] = useState(getInitialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getInitialForm());
  }, [getInitialForm]);

  const {
    title: formTitle,
    photo: formPhoto,
    description: formDescription,
    usefulLinkId: formUsefulLinkId,
    document: formDocument
  } = form;

  const handleInputChange = useCallback((field) => (e) => {
    const value = field === 'photo' || field === 'document'
      ? e.target.files[0]
      : e.target.value;

    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formTitle?.trim()) {
      newErrors.title = 'Назва обов\'язкова';
    }

    if (!isEditing && (!formPhoto || !(formPhoto instanceof File))) {
      newErrors.photo = 'Фото схеми обов\'язкове';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formTitle, formPhoto, isEditing]);

  const profileId = profile?.id;

  const submitLogic = useCallback(async () => {
    if (!validateForm()) return;

    if (!profileId) {
      alert('Авторизуйтесь для збереження схеми!');
      return;
    }

    try {
      const submitData = {
        title: formTitle?.trim() || '',
        description: formDescription?.trim() || '',
        componentId,
        usefulLinkId: formUsefulLinkId || null,
      };

      console.log('Modal відправляє в стор:', {
        isEditing,
        schematicId,
        ...submitData,
        hasPhoto: !!formPhoto,
        hasDocument: !!formDocument,
        userId: profileId
      });

      if (isEditing && schematicId) {
        await updateSchematic(schematicId, submitData, formPhoto, formDocument);
      } else {
        await addSchematic(submitData, formPhoto, formDocument);
      }

      onClose();
    } catch (error) {
      console.error('Modal submit FAILED:', error);
      alert('Помилка збереження: ' + (error.message || 'Невідома помилка'));
    }
  }, [
    formTitle,
    formDescription,
    formUsefulLinkId,
    formPhoto,
    formDocument,
    componentId,
    profileId,
    isEditing,
    schematicId,
    updateSchematic,
    addSchematic,
    onClose,
    validateForm
  ]);

  const handleSubmit = useCallback(() => {
    submitLogic();
  }, [submitLogic]);

  const getImageUrl = useCallback(() => {
    return formPhoto ? URL.createObjectURL(formPhoto) : schematic?.photoUrl || '';
  }, [formPhoto, schematic?.photoUrl]);

  return {
    form,
    errors,
    handleInputChange,
    handleSubmit,
    getComponentName,
    isEditing,
    getImageUrl
  };
};

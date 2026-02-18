import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCategoriesStore } from '@store/useCategoriesStore';
import { useTagsStore } from '@store/useTagsStore';

export const useComponentForm = ({ component, isEditing, onClose, onSubmit }) => {
  const categories = useCategoriesStore(state => state.categories);
  const tagsStore = useTagsStore();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({});
  const [tags, setTags] = useState([]);

  const categoryOptions = useMemo(() => 
    categories.map(cat => ({ value: cat.id, label: cat.title || cat.name })), 
  [categories]);

  const defaultForm = useMemo(() => ({
    name: isEditing && component?.name || '',
    description: isEditing && component?.description || '',
    price: isEditing && component?.price?.toString() || '',
    quantity: isEditing && component?.quantity?.toString() || '',
    categoryId: isEditing && component?.categoryId || '',
    documentationLink: isEditing && (component?.documentationLink || component?.docLink) || '',
    supplierLink: isEditing && (component?.supplierLink || component?.buyLink) || '',
    tagInput: '',
    photoName: '',
  }), [isEditing, component]);

  const defaultTags = useMemo(() => {
    if (!isEditing || !component?.tags) return [];

    if (typeof component.tags === 'string') {
      return component.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    if (Array.isArray(component.tags)) {
      return component.tags.map(tag => {
        if (typeof tag === 'object' && tag?.name) return tag.name;
        if (typeof tag === 'object' && tag?.title) return tag.title;
        return String(tag);
      }).filter(Boolean);
    }
    
    return [];
  }, [isEditing, component]);

  useEffect(() => {
    setForm(defaultForm);
    setSelectedFile(null);
  }, [defaultForm]);

  useEffect(() => {
    setTags(defaultTags);
  }, [defaultTags]);

  const handleInputChange = useCallback((field) => (e) => {
    if (field === 'photo') {
      const file = e.target.files[0];
      setSelectedFile(file);
      setForm(prev => ({ ...prev, photoName: file?.name || '' }));
    } else {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    }
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setForm(prev => ({ ...prev, categoryId: e.target.value }));
  }, []);

  const addTag = useCallback(() => {
    const newTag = form.tagInput?.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setForm(prev => ({ ...prev, tagInput: '' }));
    }
  }, [form.tagInput, tags]);

  const removeTag = useCallback((tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const handleCloseModal = useCallback(() => {
    setForm(defaultForm);
    setTags(defaultTags);
    setSelectedFile(null);
    onClose();
  }, [defaultForm, defaultTags, onClose]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const safeTags = Array.isArray(tags) ? tags : [];
      const tagIds = await Promise.all(
        safeTags.map(async (tagName) => {
          try {
            const tag = await tagsStore.createTag(tagName);
            return tag?.id;
          } catch (error) {
            console.warn('Помилка тегу:', tagName, error);
            return null;
          }
        })
      );
      
      const validTagIds = tagIds.filter(id => id != null);

      const formData = {
        categoryId: form.categoryId || null,
        name: form.name || '',
        description: form.description || '',
        quantity: parseInt(form.quantity) || 0,
        price: parseFloat(form.price) || 0,
        supplierLink: form.supplierLink || '',
        documentationLink: form.documentationLink || '',
        tagIds: validTagIds,
      };

      await onSubmit(formData, selectedFile);
      handleCloseModal();
    } catch (error) {
      console.error('Помилка:', error);
    }
  }, [form, tags, tagsStore, onSubmit, handleCloseModal, selectedFile]);

const isValid = useMemo(() => {
  const hasName = Boolean(form.name?.trim());
  const hasCategory = Boolean(form.categoryId);
  
  if (isEditing) {
    return hasName && hasCategory;
  }
  
  return hasName && hasCategory && Boolean(selectedFile);
}, [form.name, form.categoryId, selectedFile, isEditing]);

  return {
    form,
    tags,
    selectedFile,
    categoryOptions,
    isValid,
    handlers: {
      handleInputChange,
      handleCategoryChange,
      addTag,
      removeTag,
      handleKeyPress,
      handleCloseModal,
      handleSubmit,
    }
  };
};

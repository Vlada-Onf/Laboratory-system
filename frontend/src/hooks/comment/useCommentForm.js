import { useState, useCallback } from 'react';

export const useCommentForm = (initialText = '') => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setText(initialText);
  }, [initialText]);

  const save = useCallback((newText) => {
    if (newText.trim()) {
      setText(newText.trim());
      setIsEditing(false);
      return newText.trim();
    }
    return null;
  }, []);

  const cancel = useCallback(() => {
    setText(initialText);
    setIsEditing(false);
  }, [initialText]);

  const isValid = text.trim();

  return {
    isEditing,
    text,
    setText,
    startEdit,
    save,
    cancel,
    isValid
  };
};

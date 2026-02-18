import React, { useState, useMemo } from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { useTheme } from '../../../context/useTheme';

const CommentCard = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.content || comment.text || '');
  const { isDarkMode } = useTheme();

  const authorName = 'Дарина';
  const avatarSrc = 'https://ui-avatars.com/api/?name=Дарина&size=40&background=1976d2&color=fff';

  const formattedDate = useMemo(() => {
    const date = comment.createdAt ? new Date(comment.createdAt) : new Date();
    return date.toLocaleDateString('uk-UA');
  }, [comment.createdAt]);

  const handleSave = () => {
    onUpdate(comment.id, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(comment.content || comment.text || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  return (
    <Box sx={{display: 'flex', gap: 2, p: 2, mb: 2, borderRadius: 2,
      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e0e0e0'
    }}>

      <Avatar src={avatarSrc} sx={{ width: 44, height: 44 }}> Д </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {authorName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          />
        ) : (
          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.5 }}>{text || ''}</Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing ? (
            <>
              <Button size="small" variant="outlined" onClick={handleSave} disabled={!text.trim()}>Зберегти</Button>

              <Button size="small" onClick={handleCancel}>Скасувати</Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={() => setIsEditing(true)}> Редагувати </Button>

              <Button size="small" onClick={handleDelete} color="error"> Видалити </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommentCard;

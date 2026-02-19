import React, { useState, useCallback, useEffect } from 'react';
import {Box, TextField, Button, Typography, CircularProgress} from '@mui/material';
import { useCommentsStore } from '@store/useCommentsStore';
import CommentCard from './CommentCard';

const CommentsBlock = ({ componentId }) => {
  const [newComment, setNewComment] = useState('');
  const {
    commentsByComponent, isLoading,
    fetchCommentsByComponent, addComment,
    updateComment, deleteComment
  } = useCommentsStore();

  useEffect(() => {
    if (componentId) {
      fetchCommentsByComponent(componentId);
    }
  }, [componentId, fetchCommentsByComponent]);

  const handleUpdateComment = useCallback((id, text) => {
    updateComment(componentId, id, text);
  }, [componentId, updateComment]);

  const handleDeleteComment = useCallback((id) => {
    deleteComment(componentId, id);
  }, [componentId, deleteComment]);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()){
      return;
    }
    addComment(componentId, newComment.trim());
    setNewComment('');
  }, [newComment, componentId, addComment]);

  if (!componentId) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Помилка: componentId не передано</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2">Завантажуємо коментарі...</Typography>
      </Box>
    );
  }

  const comments = commentsByComponent[componentId] || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Залиште коментар..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          maxRows={4}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={!newComment.trim() || isLoading}
          sx={{
            fontSize: 16,
            height: 58,
            minWidth: 120,
            color: '#fff',
            background: 'linear-gradient(135deg, #08273b, #365468)',
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)',
            },
            '&:disabled': {
              background: 'rgba(8, 39, 59, 0.5)',
            },
          }}
        >
          Надіслати
        </Button>
      </Box>

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
          Коментарів поки немає. Будьте першим!
        </Typography>
      ) : (
        <Box sx={{ maxHeight: 400, overflow: 'auto', borderRadius: 1, }}>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentsBlock;

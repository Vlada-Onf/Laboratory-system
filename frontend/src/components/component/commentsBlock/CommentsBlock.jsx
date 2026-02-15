import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress
} from '@mui/material';
import { useCommentsStore } from '../../../store/useCommentsStore';
import { useComponentsStore } from '../../../store/useComponentsStore';
import CommentCard from './CommentCard';

const CommentsBlock = ({ componentId }) => {
  const [newComment, setNewComment] = useState('');
  const { components } = useComponentsStore();
  const {
    commentsByComponent,
    isLoading,
    fetchCommentsByComponent,
    addComment,
    updateComment,
    deleteComment
  } = useCommentsStore();
  

  useEffect(() => {
    if (componentId) {
      fetchCommentsByComponent(componentId);
    }
  }, [componentId, fetchCommentsByComponent]);

  const comments = commentsByComponent[componentId] || [];
  const getComponentName = useCallback((id) => {
    if (!id) return 'невідомий компонент';
    const component = components.find(c => c.id === id);
    return component?.name || `компонент ${String(id).slice(0, 8)}`;
  }, [components]);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) return;
    
    addComment(componentId, newComment.trim());
    setNewComment('');
  }, [newComment, componentId, addComment, getComponentName]);

  if (!componentId) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Помилка: componentId не передано
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress /> 
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Залиште коментар..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          maxRows={4}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          sx={{
            fontSize: 16,
            height: 58,
            color: '#fff',
            background: 'linear-gradient(135deg, #08273b , #365468 )',
            
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)',
            },
          }}
        >
          Надіслати
        </Button>
      </Box>
      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          Коментарів поки немає. Будьте першим!
        </Typography>
      ) : (
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {comments.map((comment) => (
  <CommentCard
    key={comment.id}
    comment={comment}
    onUpdate={(id, text) => updateComment(componentId, id, text)}
    onDelete={(id) => deleteComment(componentId, id)}
  />
))}
        </Box>
      )}
    </Box>
  );
};

export default CommentsBlock;

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import CommentCard from './CommentCard';
import { useComments } from './../../../hooks/useComments';

const CommentsBlock = () => {
  const { comments, addComment, updateComment, replyToComment, deleteComment } = useComments();
  const [newComment, setNewComment] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Залиште коментар..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            addComment(newComment);
            setNewComment('');
          }}
          sx={{
            fontSize: 16,
            height: 58,
            background: 'linear-gradient(135deg, #08273b, #365468)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)',
            },
          }}
        >
          Надіслати
        </Button>
      </Box>

      <Box>
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onUpdate={updateComment}
            onReply={replyToComment}
            onDelete={deleteComment}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CommentsBlock;

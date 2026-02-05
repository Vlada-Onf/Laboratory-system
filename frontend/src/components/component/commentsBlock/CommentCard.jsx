import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { useTheme } from '../../../context/useTheme';

const CommentCard = ({ comment, onUpdate, onReply, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const { isDarkMode } = useTheme();

  const handleSave = () => {
    onUpdate(comment.id, text);
    setIsEditing(false);
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      return;
    }

    onReply(comment.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Avatar src={comment.avatar} alt={comment.author} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {comment.author}
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              multiline
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          ) : (
            <Typography variant="body2">
              {comment.text}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            {isEditing ? (
              <Button
                size="small"
                onClick={() => {
                  handleSave();
                }}
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(211, 47, 47, 0.08)'
                  },
                }}
              >
                Зберегти
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => {
                  setIsEditing(true);
                }}
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(211, 47, 47, 0.08)'
                  },
                }}
              >
                Редагувати
              </Button>
            )}

            <Button
              size="small"
              onClick={() => {
                setIsReplying(!isReplying);
              }}
              sx={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(211, 47, 47, 0.08)'
                },
              }}
            >
              Відповісти
            </Button>

            <Button
              size="small"
              onClick={() => {
                handleDelete();
              }}
              sx={{
                color: isDarkMode ? '#f16731' : '#f16731',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? 'rgba(241, 103, 49, 0.15)'
                    : 'rgba(241, 103, 49, 0.15)'
                },
              }}
            >
              Видалити
            </Button>
          </Box>

          {isReplying && (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                placeholder="Ваша відповідь..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                size="small"
                onClick={handleReply}
                sx={{
                  mt: 0.5,
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(211, 47, 47, 0.08)'
                  },
                }}
              >
                Надіслати
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {comment.replies?.length > 0 && (
        <Box sx={{
          pl: 6,
          mt: 1,
          borderLeft: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onUpdate={onUpdate}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentCard;

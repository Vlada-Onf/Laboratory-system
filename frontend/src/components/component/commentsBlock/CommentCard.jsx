import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { useTheme } from '../../../context/useTheme';
import { useProfileStore } from '../../../store/useProfileStore';
import { useCommentForm } from '../../../hooks/comment/useCommentForm';

const CommentCard = ({ comment, onUpdate, onDelete }) => {
  const { isDarkMode } = useTheme();
  const profileStore = useProfileStore();
  const currentUser = profileStore.profile;

  const { isEditing, text, setText, startEdit, save, cancel, isValid } = useCommentForm(comment.content || '');

  const isCurrentUserComment = comment.isCurrentUser === true ||
    (currentUser?.id && comment.createdBy === currentUser.id);

  const authorName = comment.displayName ||
    (comment.createdByFirstName
      ? `${comment.createdByFirstName} ${comment.createdByLastName || ''}`.trim()
      : comment.authorEmail || 'Невідомий користувач');

  const hasRealPhoto = comment.createdByPhotoUrl || comment.authorPhotoUrl;
  const avatarSrc = hasRealPhoto
    ? hasRealPhoto
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&size=44&background=f16731&color=fff`;

  const formattedDate = (() => {
    const date = comment.createdAt || comment.timeAgo;
    if (!date) return 'щойно';
    const commentDate = new Date(date);
    return commentDate.toLocaleDateString('uk-UA') + ' ' +
      commentDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  })();

  const handleDelete = () => onDelete?.(comment.id);

  const handleSave = () => {
    const result = save(text);
    if (result) onUpdate(comment.id, result);
  };

  return (
    <Box sx={{
      display: 'flex', gap: 2, p: 2, mb: 2,
      borderRadius: 2,
      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e0e0e0'
    }}>
      <Avatar src={avatarSrc} sx={{ width: 44, height: 44, color: '#ffffff !important', fontWeight: 700, fontSize: '1.1rem' }} alt={authorName}>
        {authorName.charAt(0)?.toUpperCase() || 'U'}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>{authorName}</Typography>
          <Typography variant="caption" color="text.secondary">{formattedDate}</Typography>
        </Box>

        {isEditing ? (
          <>
            <TextField
              fullWidth multiline rows={3} value={text}
              onChange={(e) => setText(e.target.value)}
              size="small" sx={{ mb: 1 }} autoFocus
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="primary" onClick={handleSave} disabled={!isValid}>
                Зберегти
              </Button>
              <Button size="small" color="primary" onClick={cancel}>Скасувати</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {comment.content || text || ''}
            </Typography>
            {isCurrentUserComment && (
              <Box sx={{ display: 'flex', gap: 1, pt: 0.5 }}>
                <Button size="small" color="primary" onClick={startEdit} sx={{ fontSize: '0.75rem' }}>
                  Редагувати
                </Button>
                <Button size="small" color="error" onClick={handleDelete} sx={{ fontSize: '0.75rem' }}>
                  Видалити
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommentCard;

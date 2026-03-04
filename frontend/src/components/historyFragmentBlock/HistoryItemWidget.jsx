import { Box, Avatar, Typography } from '@mui/material';

const HistoryItemWidget = ({ record }) => {
  const actionText = `${record.actionName || 'Дія'} • ${record.entityName || 'Сутність'}`;

  const formatTime = () => {
    if (record.timeFormatted) return record.timeFormatted;
    if (record.time) {
      return new Date(record.time).toLocaleString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return '';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', sm: 'row' },
        '&:hover': {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      <Avatar
        src={record.userAvatar}
        alt={record.userName}
        sx={{ width: 36, height: 36 }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          fontWeight={600}
          fontSize={14}
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            mb: 0.25,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {record.userName || 'Користувач'}
        </Typography>

        <Typography
          fontSize={13}
          sx={{
            color: 'rgba(255, 255, 255, 0.75)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {actionText}
        </Typography>
      </Box>

      <Typography
        fontSize={12}
        sx={{
          color: 'rgba(255, 255, 255, 0.5)',
          minWidth: 55,
          textAlign: 'right',
          fontWeight: 500
        }}
      >
        {formatTime()}
      </Typography>
    </Box>
  );
};

export default HistoryItemWidget;

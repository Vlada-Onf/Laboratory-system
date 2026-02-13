import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import HistoryItem from './HistoryItem';
import { useHistory } from '../../hooks/useHistory';
import { formatHistoryForWidget } from '../../utils/historyWidgetUtils';
import { useTheme } from '../../context/useTheme';

const HistoryBlock = () => {
  const { history, isLoading } = useHistory();
  const { isDarkMode } = useTheme();
  const darkMode = isDarkMode ?? false;

  const widgetHistory = !isLoading ? formatHistoryForWidget(history) : [];

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2, height: { xs: 320, md: 420 } }}>
        <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          Завантаження...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        height: { xs: 320, md: 420 },
        maxHeight: '70vh',
        overflowY: 'auto',
        backgroundColor: darkMode ? 'rgba(8, 39, 59, 0.35) !important' : '#08273b !important',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(8, 39, 59, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Typography fontSize={18} fontWeight={600} sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.95)' }}>
        Нещодавні зміни
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          '& > *': {
            transition: 'background-color 0.15s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: darkMode
                ? 'rgba(8, 39, 59)'
                : 'rgba(255, 255, 255, 0.05)',
            },
          },
        }}
      >
        {widgetHistory.length === 0 ? (
          <Typography fontSize={14} sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', py: 2 }}>
            Історія порожня
          </Typography>
        ) : (
          widgetHistory.map((item) => (
            <HistoryItem
              key={item.id}
              avatar={item.avatar}
              name={item.name}
              action={item.action}
              time={item.time}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default HistoryBlock;

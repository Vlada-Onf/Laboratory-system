import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import HistoryItem from './HistoryItem';

import { useTheme } from '../../context/useTheme';

const mockHistory = [
  {
    id: 1,
    avatar: 'https://img.freepik.com/free-vector/people-design-illustration_24877-49375.jpg?semt=ais_user_personalization&w=740&q=80',
    name: 'Дарина',
    action: 'Змінила компонент Arduino Uno',
    time: '5 хв тому',
  },
  {
    id: 2,
    avatar: 'https://img.freepik.com/free-vector/young-prince-royal-attire_1308-176144.jpg',
    name: 'Олексій',
    action: 'Додав компонент Arduino Uno',
    time: '1 год тому',
  },
  {
    id: 3,
    avatar: 'https://img.freepik.com/premium-vector/avatar-gril-glasses-green-shirt_693217-99.jpg?semt=ais_hybrid&w=740&q=80',
    name: 'Марія',
    action: 'Оновила статус потреби',
    time: 'вчора',
  },
  {
    id: 4,
    avatar: 'https://img.freepik.com/premium-vector/avatar-gril-glasses-green-shirt_693217-99.jpg?semt=ais_hybrid&w=740&q=80',
    name: 'Марія',
    action: 'Внесла зміни да таблиці компонентів',
    time: 'вчора',
  },
];

const HistoryBlock = () => {
  const { isDarkMode } = useTheme();

  const darkMode = isDarkMode ?? false;

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
        {mockHistory.map((item) => (
          <HistoryItem
            key={item.id}
            avatar={item.avatar}
            name={item.name}
            action={item.action}
            time={item.time}
          />
        ))}
      </Box>
    </Paper>
  );
};


export default HistoryBlock;

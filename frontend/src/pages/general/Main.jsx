import React from 'react';
import { Box, Typography } from '@mui/material';
import HistoryBlock from '../../components/historyFragmentBlock/HistoryBlock';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useTheme } from '../../context/useTheme';

const Main = () => {
  const { isDarkMode } = useTheme();

  return (
    <PageWrapper
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 1, md: 6 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pt: { xs: 4, md: 10 },
        }}
      >
        <Box
          sx={{
            maxWidth: 520,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#fff',
            transform: 'translateY(-40px)',
          }}
        >
          <Typography
            variant="h1"
            fontWeight={500}
            sx={{
              fontSize: '90px',
              lineHeight: 1,
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeUp 1s ease-out forwards',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
              '@keyframes fadeUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Вітаємо в системі
          </Typography>
        </Box>

<Box
  sx={{
    width: 420,
    maxHeight: '70vh',
    overflowY: 'auto',
    opacity: 0,
    animation: 'fadeIn 1s ease-out forwards',
    animationDelay: '1.2s',
    pr: { xs: 0, md: 8 },
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  }}
>
  <HistoryBlock />
</Box>

      </Box>
    </PageWrapper>
  );
};

export default Main;

import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import HistoryBlock from '../../components/historyFragmentBlock/HistoryBlock';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useTheme as useCustomTheme } from '../../context/useTheme';

const Main = () => {
  const customTheme = useCustomTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { isDarkMode } = customTheme;

  return (
    <PageWrapper
      sx={{
        display: isMobile ? 'flex' : 'flex',
        alignItems: isMobile ? 'center' : 'center',
        justifyContent: isMobile ? 'center' : 'center',
        px: isMobile ? { xs: 3 } : { xs: 1, md: 6 },
        py: isMobile ? { xs: 3 } : undefined,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'flex-end',
          alignItems: isMobile ? 'stretch' : 'center',
          pt: isMobile ? { xs: 2 } : { xs: 4, md: 10 },
          gap: isMobile ? 3 : 0,
        }}
      >
        <Box
          sx={{
            maxWidth: isMobile ? '100%' : 520,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transform: isMobile ? 'none' : 'translateY(-40px)',
            textAlign: 'center',
            order: isMobile ? 1 : 1,
            flex: isMobile ? 'none' : 1,
          }}
        >
          <Typography
            variant="h1"
            fontWeight={500}
            sx={{
              fontSize: isMobile ? { xs: '32px', sm: '48px' } : '90px',
              lineHeight: isMobile ? 1.1 : 1,
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
            width: isMobile ? { xs: '90%', md: 420 } : 420,
            maxWidth: isMobile ? 380 : undefined,
            mx: isMobile ? 'auto' : undefined,
            overflowY: 'auto',
            opacity: 0,
            animation: 'fadeIn 1s ease-out forwards',
            animationDelay: '1.2s',
            order: isMobile ? 2 : 2,
            pr: { xs: 0, md: 8 },
            flex: isMobile ? 1 : undefined,
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

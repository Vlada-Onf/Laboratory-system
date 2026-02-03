import React from 'react';
import { Box, Typography } from '@mui/material';
import bgImage from '../../assets/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner.webp';
import HistoryBlock from '../../components/historyFragmentBlock/HistoryBlock';

const Main = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0b1c2d',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            color: '#fff',
            maxWidth: 520,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transform: 'translateY(-60px)',
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
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <HistoryBlock />
        </Box>
      </Box>
    </Box>
  );
};

export default Main;

import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const ThemeToggleSwitch = ({ active, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        ...(isMobile ? {} : {
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: active
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: active
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.15)',
        }),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isMobile 
          ? (active ? 'rotate(180deg)' : 'rotate(0deg)')
          : (active ? 'rotate(180deg) scale(1.05)' : 'scale(1)'),
        '&:hover': {
          ...(isMobile ? {
            transform: active ? 'rotate(180deg) scale(1.1)' : 'scale(1.1)',
          } : {
            background: active
              ? 'rgba(255, 255, 255, 0.25)'
              : 'rgba(255, 255, 255, 0.35)',
            transform: active
              ? 'rotate(180deg) scale(1.08)'
              : 'scale(1.05)',
            boxShadow: active
              ? '0 12px 40px rgba(0, 0, 0, 0.4)'
              : '0 6px 24px rgba(0, 0, 0, 0.2)',
          }),
        },
      }}
      onClick={() => onChange?.(!active)}
    >
      {active ? (
        <BedtimeIcon
          sx={{
            fontSize: { xs: 22, sm: 24 },
            color: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isMobile ? 'rotateY(180deg)' : 'rotateY(180deg) scale(0.95)',
          }}
        />
      ) : (
        <WbSunnyIcon
          sx={{
            fontSize: { xs: 22, sm: 24 },
            color: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isMobile ? 'scale(1)' : 'scale(1)',
          }}
        />
      )}
    </Box>
  );
};

export default ThemeToggleSwitch;

import React from 'react';
import { Box } from '@mui/material';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const ThemeToggleSwitch = ({ active, onChange }) => {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: active
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: active
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 4px 16px rgba(0, 0, 0, 0.15)',
        transform: active ? 'rotate(180deg) scale(1.05)' : 'scale(1)',
        '&:hover': {
          background: active
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(255, 255, 255, 0.35)',
          transform: active
            ? 'rotate(180deg) scale(1.08)'
            : 'scale(1.05)',
          boxShadow: active
            ? '0 12px 40px rgba(0, 0, 0, 0.4)'
            : '0 6px 24px rgba(0, 0, 0, 0.2)',
        },
      }}
      onClick={() => onChange?.(!active)}
    >
      {active ? (
        <BedtimeIcon
          sx={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'rotateY(180deg)',
          }}
        />
      ) : (
        <WbSunnyIcon
          sx={{
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}
    </Box>
  );
};

export default ThemeToggleSwitch;

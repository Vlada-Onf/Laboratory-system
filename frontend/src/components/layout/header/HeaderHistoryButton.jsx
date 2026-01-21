import React from 'react';
import { IconButton, Badge } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';

export default function HeaderHistoryButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      aria-label="History"
      color="inherit"
      onClick={() => navigate('/history')}
    >
      <Badge
        badgeContent={17}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#841a1c',
            color: '#fff',
          },
        }}
      >
        <HistoryIcon />
      </Badge>
    </IconButton>
  );
}

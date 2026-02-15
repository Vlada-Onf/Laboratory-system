import React from 'react';
import { IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function HeaderProfileButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      edge="end"
      aria-label="Profile"
      color="inherit"
      onClick={() => navigate('/front-profile')}
    >
      <AccountCircle />
    </IconButton>
  );
}

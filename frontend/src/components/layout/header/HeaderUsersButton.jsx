import React from 'react';
import { IconButton, Badge } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';

export default function HeaderUsersButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      aria-label="Users"
      color="inherit"
      onClick={() => navigate('/users')}
    >
      <Badge
        badgeContent={4}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: '#841a1c',
            color: '#fff',
          },
        }}
      >
        <GroupsIcon />
      </Badge>
    </IconButton>
  );
}

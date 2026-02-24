import React, { useEffect } from 'react';
import { Avatar, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@store/useProfileStore';

export default function HeaderProfileButton() {
  const navigate = useNavigate();
  const { profile: user, loading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!user && !loading) {
      fetchProfile();
    }
  }, [user, loading, fetchProfile]);
  if (loading || !user) {
    return (
      <IconButton size="large" disabled sx={{ opacity: 0.5 }}>
        <CircularProgress size={24} />
      </IconButton>
    );
  }
  const getInitials = (firstName = '', lastName = '') => {
    if (!firstName && !lastName){
      return '';
    }
    const first = firstName.charAt(0)?.toUpperCase() || '';
    const last = lastName.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const hasPhoto = user.photoUrl && user.photoUrl.trim() !== '';


  const avatarContent = hasPhoto ? (
    <Avatar
      src={user.photoUrl}
      alt={`${user.firstName || ''} ${user.lastName || ''}`}
      sx={{
        width: 40,
        height: 40,
        img: { objectFit: 'cover' }
      }}
    />
  ) : (
    <Avatar sx={{ width: 40, height: 40, bgcolor: '#f16731', fontWeight: 300 , fontSize: 16 }}>
      {getInitials(user.firstName, user.lastName)}
    </Avatar>
  );

  return (
    <Tooltip title={`${user.firstName || 'Користувач'} ${user.lastName}`} arrow>
      <IconButton
        size="large"
        edge="end"
        aria-label="Profile"
        onClick={() => navigate('/front-profile')}
        sx={{ ml: 1 }}
      >
        {avatarContent}
      </IconButton>
    </Tooltip>
  );
}

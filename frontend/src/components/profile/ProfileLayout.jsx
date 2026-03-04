import React, { useState } from 'react';
import { Box, Divider, Typography, Paper, Chip,Dialog,DialogTitle,DialogContent,DialogActions,Button,CircularProgress,Alert,TextField,IconButton} from '@mui/material';
import { CheckCircle,  Person,  Block,Close, Logout} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileCard from './ProfileCard';
import { useProfileStore } from '@store/useProfileStore';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const {
    profile,
    loading: profileLoading,
    error,
    fetchProfile,
    updateProfile,
    logout,
    clearError
  } = useProfileStore();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    image: null
  });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate('/sign-in', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleOpenEdit = () => {
    setEditForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      image: null
    });
    setOpenEditModal(true);
    clearError();
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setEditForm({ firstName: '', lastName: '', image: null });
    clearError();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm(prev => ({ ...prev, image: files[0] || null }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(editForm.firstName, editForm.lastName, editForm.image);
      setOpenEditModal(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (profileLoading || !profile) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 5, px: { xs: 5, sm: 8, md: 12, lg: 20 } }}>
        <ProfileHeader user={profile} onEdit={handleOpenEdit} />
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <ProfileCard user={profile} />
          </Box>

          <Paper sx={{ p: 3 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(2, 1fr)' },
              gap: 3
            }}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {new Date(profile.createdAt).toLocaleDateString('uk-UA')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />Дата реєстрації
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Chip
                  icon={profile.isActive ? <CheckCircle /> : <Block />}
                  label={profile.isActive ? 'Активний' : 'Заблокований'}
                  color={profile.isActive ? 'success' : 'error'}
                  variant="filled"
                  sx={{ fontSize: '1.1rem', fontWeight: 600, height: 40 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Статус профілю
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(244, 67, 54, 0.9)',
          color: 'white',
          p: 2,
          borderRadius: 3,
          boxShadow: 6,
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            bgcolor: '#f44336',
            transform: 'scale(1.05)',
            boxShadow: 8
          }
        }}
        onClick={handleLogoutClick}
      >
        <IconButton sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }} size="small">
          <Logout />
        </IconButton>
        <Typography variant="body2" fontWeight={600}>
          Вийти з системи
        </Typography>
      </Box>

      <Dialog open={logoutModalOpen} onClose={handleLogoutCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Підтвердити вихід</DialogTitle>
        <DialogContent>
          <Typography>
            Ви дійсно хочете вийти з системи? Сесія буде завершена.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} disabled={logoutLoading}>
            Скасувати
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            disabled={logoutLoading}
            startIcon={logoutLoading ? <CircularProgress size={20} /> : null}
          >
            {logoutLoading ? 'Вихід...' : 'Вийти'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>
          Редагувати профіль
          <Button
            onClick={handleCloseEdit}
            sx={{ position: 'absolute', right: 16, top: 12, minWidth: 'auto', padding: 0.5 }}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
        Ім'я
      </Typography>
            <TextField
              name="firstName"
              value={editForm.firstName}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>Прізвище</Typography>
            <TextField
              name="lastName"
              value={editForm.lastName}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>Фото профілю</Typography>
            <TextField
              type="file"
              name="image"
              onChange={handleInputChange}
              fullWidth
              accept="image/*"
              inputProps={{ multiple: false }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit}>Скасувати</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={profileLoading}
            startIcon={profileLoading ? <CircularProgress size={20} /> : null}
          >
            {profileLoading ? 'Зберігаємо...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileLayout;

import React from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';

const ProfileCard = ({ user }) => {
  if (!user) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Завантаження...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Особисті дані
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600}  sx={{ mb: 1 }}>
          Email
        </Typography>
        <TextField
          value={user.email || 'N/A'}
          fullWidth
          disabled
          InputProps={{ readOnly: true }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Ім'я
        </Typography>
        <TextField
          value={user.firstName || 'N/A'}
          fullWidth
          disabled
          InputProps={{ readOnly: true}}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600}  sx={{ mb: 1 }}>
          Прізвище
        </Typography>
        <TextField
          value={user.lastName || 'N/A'}
          fullWidth
          disabled
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Paper>
  );
};

export default ProfileCard;

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const UserCell = ({ avatar, name, email }) => {
  return (
    <Box display="flex" alignItems="center">
      <Avatar src={avatar} alt={name} sx={{ width: 40, height: 40, mr: 2 }} />
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: '#08273b' }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserCell;

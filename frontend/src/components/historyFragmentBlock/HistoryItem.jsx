import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const HistoryItem = ({ avatar, name, action, time }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
  backdropFilter: 'blur(6px)',
}


      }}
    >
      <Avatar src={avatar} alt={name} />

      <Box sx={{ flex: 1}}>
        <Typography fontWeight={600} fontSize={14} sx={{ color: 'rgba(255, 255, 255, 0.95) ' }}>
          {name}
        </Typography>

        <Typography fontSize={13} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {action}
        </Typography>
      </Box>

      <Typography
        fontSize={12}
        color="text.secondary"
        sx={{ color: 'rgba(255, 255, 255, 0.55)'
 }}
      >
        {time}
      </Typography>
    </Box>
  );
};

export default HistoryItem;

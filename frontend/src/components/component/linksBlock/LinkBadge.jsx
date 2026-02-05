import React from 'react';
import { Chip, useTheme } from '@mui/material';
import LinkCell from './../../general/LinkCell';

const LinkBadge = ({ url, color = '#1976d2' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  if (!url) {
    return null;
  }

  return (
    <Chip
      variant="outlined"
      sx={{
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : color,
        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : color,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
      }}
      label={<LinkCell url={url} />}
    />
  );
};

export default React.memo(LinkBadge);

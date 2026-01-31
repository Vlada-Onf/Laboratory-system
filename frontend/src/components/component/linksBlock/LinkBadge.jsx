import React from 'react';
import { Chip } from '@mui/material';
import LinkCell from './../../general/LinkCell';

const LinkBadge = ({ url, color = '#1976d2' }) => {
  if (!url) {
    return null;
  }

  return (
    <Chip
      variant="outlined"
      sx={{
        borderColor: color,
        color: color,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
      }}
      label={<LinkCell url={url} />}
    />
  );
};

export default React.memo(LinkBadge);

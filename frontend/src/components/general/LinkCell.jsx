import React, { useState, memo } from 'react';
import { Link, Tooltip, Typography, useTheme } from '@mui/material';

const LinkCell = memo(({ url }) => {
  const [domain, setDomain] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  React.useEffect(() => {
    if (!url) {
      setDomain('');
      return;
    }

    try {
      const parsed = new URL(url);
      setDomain(parsed.hostname);
    } catch {
      setDomain(url.slice(0, 30) + '...');
    }
  }, [url]);

  if (!url) {
    return <Typography variant="body2" color="text.secondary">—</Typography>;
  }

  return (
    <Tooltip title={url}>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            color: isDarkMode ? '#fff' : 'primary.dark',
          }
        }}
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${url}&sz=16`}
          alt="Favicon"
          width={16}
          height={16}
          style={{ borderRadius: 2 }}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <Typography
          variant="body2"
          noWrap
          sx={{
            maxWidth: 180,
            color: 'inherit',
          }}
        >
          {domain || url.slice(0, 30) + '...'}
        </Typography>
      </Link>
    </Tooltip>
  );
});

LinkCell.displayName = 'LinkCell';
export default LinkCell;

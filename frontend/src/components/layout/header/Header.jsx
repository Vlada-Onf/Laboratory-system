import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '../../../context/useTheme';
import ThemeToggleSwitch from './ThemeToggleSwitch';

import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';
import HeaderUsersButton from './HeaderUsersButton';
import HeaderHistoryButton from './HeaderHistoryButton';
import HeaderProfileButton from './HeaderProfileButton';

export default function Header({ onMenuClick }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#08273b !important',
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
          color: 'rgba(255, 255, 255, 0.9) !important',
          '& .MuiTypography-root': {
            color: 'rgba(255, 255, 255, 0.9) !important',
          },
          zIndex: 1201,
              }}
            >
      <Toolbar>
          <HeaderMenu onClick={onMenuClick} />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}
          >
            Laboratory System
          </Typography>

          <HeaderSearch />
          <ThemeToggleSwitch
            active={isDarkMode}
            onChange={toggleTheme}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HeaderUsersButton />
            <HeaderHistoryButton />
            <HeaderProfileButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

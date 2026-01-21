import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';
import HeaderUsersButton from './HeaderUsersButton';
import HeaderHistoryButton from './HeaderHistoryButton';
import HeaderProfileButton from './HeaderProfileButton';

export default function Header({ onMenuClick }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#08273b' }}>
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

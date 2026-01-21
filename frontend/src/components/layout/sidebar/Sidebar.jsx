import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SignpostIcon from '@mui/icons-material/Signpost';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;
const HEADER_HEIGHT = 64;

export default function Sidebar({ open }) {
  const location = useLocation();

  const menuItems = [
    { text: 'Статистика', icon: <AnalyticsIcon />, path: '/dashboard' },
    { text: 'Категорії', icon: <SignpostIcon />, path: '/categories' },
    { text: 'Компоненти', icon: <WidgetsIcon />, path: '/components' },
    { text: 'Потреби', icon: <TurnedInIcon />, path: '/needs' },
    { text: 'Бажане', icon: <FavoriteIcon />, path: '/wishlist' },
  ];

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: '#08273b',
          top: HEADER_HEIGHT,
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          overflowX: 'hidden',
          transition: 'width 0.3s',
        },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#fff',
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    color: '#fff',
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

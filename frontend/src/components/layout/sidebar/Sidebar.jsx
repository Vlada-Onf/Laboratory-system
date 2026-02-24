import { useEffect, useMemo } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,Skeleton,useTheme,useMediaQuery} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SignpostIcon from '@mui/icons-material/Signpost';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';
const ADMIN_ROLE_ID = 'f909c5e7-fe8f-42c8-aedc-bff8862f8e03';
const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;
const HEADER_HEIGHT = 64;

export default function Sidebar({ open }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    user,
    fetchCurrentUser,
    loading: authLoading
  } = useAuthStore();

  const effectiveOpen = isMobile ? false : open;

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const userRoles = useMemo(() => {
    const roles = [];
    if (user?.roleId) {
      roles.push(user.roleId);
    }
    if (user?.roles && Array.isArray(user.roles)) {
      roles.push(...user.roles);
    }
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.roleId){
          roles.push(payload.roleId);
        }
        if (payload.roles && Array.isArray(payload.roles)) {
          roles.push(...payload.roles);
        }
        if (payload.role) roles.push(payload.role);
      }
    } catch (error) {
      console.error('JWT parse error:', error);
    }

    return [...new Set(roles)];
  }, [user]);

  const isLabRole = useMemo(() => {
    return userRoles.includes(LAB_ROLE_ID);
  }, [userRoles]);

  const isAdminRole = useMemo(() => {
    return userRoles.includes(ADMIN_ROLE_ID);
  }, [userRoles]);

  const hasSettingsAccess = useMemo(() => {
    return !isLabRole && !isAdminRole;
  }, [isLabRole, isAdminRole]);

  const labMenuItems = [
    { text: 'Головна', icon: <HomeIcon />, path: '/front-main' },
    { text: 'Категорії', icon: <SignpostIcon />, path: '/front-categories' },
    { text: 'Компоненти', icon: <WidgetsIcon />, path: '/front-components' },
    { text: 'Вішліст', icon: <FavoriteIcon />, path: '/front-wishlist' },
  ];

  const fullMenuItems = useMemo(() => {
    const items = [
      ...labMenuItems,
      { text: 'Потреби', icon: <TurnedInIcon />, path: '/front-needs' },
      { text: 'Статистика', icon: <AnalyticsIcon />, path: '/front-dashboard' },
      { text: 'Пошкодження', icon: <BuildIcon />, path: '/front-brokenComponents' },
    ];
    
    if (hasSettingsAccess) {
      items.push({ text: 'Налаштування', icon: <SettingsIcon />, path: '/front-settings' });
    }
    
    return items;
  }, [labMenuItems, hasSettingsAccess]);

  const menuItems = isLabRole ? labMenuItems : fullMenuItems;

  if (authLoading || !user) {
    return (
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            backgroundColor: '#08273b',
            top: isMobile ? 0 : HEADER_HEIGHT,
            height: isMobile ? '100vh' : `calc(100% - ${HEADER_HEIGHT}px)`,
            width: isMobile ? COLLAPSED_WIDTH : (effectiveOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH),
            left: 0,
            position: 'fixed',
            zIndex: 1200,
            overflowX: 'hidden',
          },
        }}
      >
        <List sx={{ p: 0, pb: 2, pt: isMobile ? '60px' : 2 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ListItem key={i} disablePadding sx={{ py: 0.25 }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={48} 
                sx={{ borderRadius: 1, mx: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: '#08273b',
          top: isMobile ? 0 : HEADER_HEIGHT,
          height: isMobile ? '100vh' : `calc(100% - ${HEADER_HEIGHT}px)`,
          width: isMobile ? COLLAPSED_WIDTH : (effectiveOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH),
          left: 0,
          position: 'fixed',
          zIndex: 1200,
          overflowX: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
    >
      <List sx={{ p: 0, pb: 2, pt: isMobile ? '60px' : 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ py: 0.25 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={active}
                sx={{
                  minHeight: 48,
                  justifyContent: effectiveOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 1,
                  mx: 0.5,
                  backgroundColor: active 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#fff',
                    minWidth: 0,
                    mr: effectiveOpen ? 2.5 : 'auto',
                    justifyContent: 'center',
                    fontSize: { xs: 20, md: 24 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                  sx={{
                    color: '#fff',
                    opacity: effectiveOpen ? 1 : 0,
                    transition: 'opacity 0.2s',
                    display: effectiveOpen ? 'block' : 'none',
                    ml: 1,
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

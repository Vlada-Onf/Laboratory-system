import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';
export default function HeaderMenu({ onClick }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!isDesktop) return null;

  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={onClick}
    >
      <MenuIcon />
    </IconButton>
  );
}

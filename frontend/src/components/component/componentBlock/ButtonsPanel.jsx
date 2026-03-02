import { Box, Button } from '@mui/material';
import { useTheme } from '../../../context/useTheme';
import { useAuthStore } from '../../../store/useAuthStore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const ButtonsPanel = ({onEdit, onDelete, onAddNeed, isDarkMode: externalDarkMode }) => {
  const { isDarkMode } = useTheme();
  const darkMode = externalDarkMode ?? isDarkMode;
  const textColor = darkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b';

  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId) roles.push(user.roleId);
    if (user?.roles && Array.isArray(user.roles)) roles.push(...user.roles);
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);

  if (isLabRole) {
    return (
      <Box sx={{ mt: 3, height: 58 }} />
    );
  }

  return (
    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
      {onEdit && (
        <Button
          onClick={onEdit}
          startIcon={
            <EditIcon sx={{display: { xs: 'none', md: 'block' }}} />
          }
          variant="contained"
          fullWidth
          sx={{
            fontSize: { xs: 14, sm: 15, md: 16 },
            height: 58,
            background: 'linear-gradient(135deg, #08273b, #365468)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #051926, #20314a)',
            },
          }}
        >
          Редагувати
        </Button>
      )}

      {onAddNeed && (
        <Button
          onClick={onAddNeed}
          variant="outlined"
          fullWidth
          sx={{
            fontSize: { xs: 14, sm: 15, md: 16 },
            height: 58,
            color: textColor,
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : '#08273b',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10,14,57,0.08)',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : '#051926',
              color: darkMode ? 'rgba(255, 255, 255, 1)' : '#051926',
            },
          }}
        >
          В потреби
        </Button>
      )}

      {onDelete && (
        <Button
          onClick={onDelete}
          startIcon={
            <DeleteIcon sx={{ display: { xs: 'none', md: 'block' } }} />
          }
          variant="contained"
          fullWidth
          sx={{
            fontSize: { xs: 14, sm: 15, md: 16 },
            height: 58,
            background: 'linear-gradient(135deg, #f16731, #f4926c)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #b74e24, #d07f5e)',
            },
          }}
        >
          Видалити
        </Button>
      )}
    </Box>
  );
};

export default ButtonsPanel;

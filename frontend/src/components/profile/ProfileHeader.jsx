import { Box, Avatar, Typography, Chip, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';

const ProfileHeader = ({ user, onEdit }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' }, 
      alignItems: { md: 'center' },
      gap: 3 
    }}>
      <Avatar 
        src={user.photoUrl}
        sx={{ width: 100, height: 100 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          {user.firstName} {user.lastName}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={user.roleName} />
        </Box>
      </Box>
      <Button 
        variant="contained" 
        startIcon={<Edit />}
        onClick={onEdit}
      >
        Редагувати
      </Button>
    </Box>
  );
};

export default ProfileHeader;

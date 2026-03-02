import { Avatar, Box, Typography } from '@mui/material';
import { useProfileStore } from '@store/useProfileStore';

const UserCell = ({ avatar, name, email, firstName, lastName }) => {
  const { profile: currentUser } = useProfileStore();

  const displayFirstName = firstName || currentUser?.firstName || '';
  const displayLastName = lastName || currentUser?.lastName || '';

  const getInitials = (firstName = '', lastName = '') => {
    if (!firstName && !lastName){
      return '';
    }
    const first = firstName.charAt(0)?.toUpperCase() || '';
    const last = lastName.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const hasPhoto = avatar && avatar.trim() !== '';

  const avatarContent = hasPhoto ? (
    <Avatar
      src={avatar}
      alt={name}
      sx={{
        width: 40,
        height: 40,
        mr: 2,
        img: { objectFit: 'cover' }
      }}
    />
  ) : (
    <Avatar sx={{
      width: 40,
      height: 40,
      mr: 2,
      bgcolor: '#f16731',
      fontWeight: 300,
      fontSize: 16
    }}>
      {getInitials(displayFirstName, displayLastName)}
    </Avatar>
  );

  return (
    <Box display="flex" alignItems="center">
      {avatarContent}
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserCell;

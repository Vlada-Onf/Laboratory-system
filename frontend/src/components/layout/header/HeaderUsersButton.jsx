import { IconButton, Badge } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';

export default function HeaderUsersButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      aria-label="Users"
      color="inherit"
      onClick={() => navigate('/front-users')}
    >
        <GroupsIcon />
    </IconButton>
  );
}

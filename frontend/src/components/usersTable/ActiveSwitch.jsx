import { Switch } from '@mui/material';
import { useAdminUsersStore } from '@store/useAdminUsersStore';

const ActiveSwitch = ({ active, userId, disabled = false }) => {
  const { toggleUserStatus, loading } = useAdminUsersStore();

  const handleChange = async (checked) => {
    if (disabled){
      return;
    }
    
    try {
      await toggleUserStatus(userId, checked);
    } catch (error) {
      console.error('ActiveSwitch error:', error);
    }
  };

  return (
    <Switch
      checked={active}
      onChange={(e) => handleChange(e.target.checked)}
      disabled={disabled || loading}
      size="small"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#5bc522 !important',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#5bc522 !important',
        },
        '& .MuiSwitch-switchBase:not(.Mui-checked)': {
          color: '#ff4444',
        },
        '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
          backgroundColor: '#ff4444',
        },
      }}
    />
  );
};

export default ActiveSwitch;

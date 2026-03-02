import Item from './../Item';
import SectionTitle from './../SectionTitle';
import { Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useAuthStore } from '../../../store/useAuthStore';

const LAB_ROLE_ID = 'bbc9c32e-8c47-43f4-bc68-c29f81754dac';

const StatCard = ({
  title,
  value,
  bgcolor,
  titleColor,
  onEdit,
  showEditButton = false
}) => {
  const { user } = useAuthStore();
  const getUserRoles = () => {
    const roles = [];
    if (user?.roleId) roles.push(user.roleId);
    if (user?.roles && Array.isArray(user.roles)) roles.push(...user.roles);
    return [...new Set(roles)];
  };
  const userRoles = getUserRoles();
  const isLabRole = userRoles.includes(LAB_ROLE_ID);

  const showEdit = showEditButton && !isLabRole && onEdit;

  return (
    <Item
      sx={{
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        background: bgcolor || '#08273b',
        position: 'relative',
        p: 2
      }}
    >
      <SectionTitle color={titleColor || '#fff'}>{title}</SectionTitle>
      <Typography variant="h4" fontWeight={600} color="#fff">{value}</Typography>

      {showEdit && (
        <IconButton
          onClick={onEdit}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            }
          }}
          size="small"
        >
          <EditIcon />
        </IconButton>
      )}
    </Item>
  );
};

export default StatCard;

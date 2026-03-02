import { useMemo, useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import { useRolesStore } from '@store/useRolesStore';
import { useAdminUsersStore } from '@store/useAdminUsersStore';
import apiClient from '../././../api/client';

export default function RoleChip({ userId, disabled = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localRole, setLocalRole] = useState(null);
  const { roles } = useRolesStore();
  const adminUsers = useAdminUsersStore(state => state.adminUsers);

  const open = Boolean(anchorEl);

  const currentUser = useMemo(() =>
    adminUsers.find(user => user.id === userId),
    [adminUsers, userId]
  );

  const displayRole = localRole || currentUser?.roleName || 'User';

  const roleColors = {
    SuperAdmin: '#f16731',
    Admin: '#1976d2',
    Lab: '#5bc522',
    User: '#9e9e9e',
  };

  const getRoleColor = (roleName) => roleColors[roleName] ?? '#666';
  const getRoleBackground = (roleName) => `${getRoleColor(roleName)}22`;

  const handleClick = (event) => {
    if (!disabled) setAnchorEl(event.currentTarget);
  };

  const handleClose = async (newRoleName) => {
    setAnchorEl(null);

    if (newRoleName && newRoleName !== displayRole && !disabled && userId) {
      const newRole = roles.find(r => r.name === newRoleName);

      if (newRole) {
        setLocalRole(newRoleName);
        try {
          await apiClient.put(`/users/${userId}`, {
            roleId: newRole.id
          });
        } catch (error) {
          console.error('API помилка:', error)
        }
      }
    }
  };

  return (
    <>
      <Chip
        label={displayRole}
        clickable={!disabled}
        onClick={handleClick}
        variant="outlined"
        disabled={disabled}
        sx={{
          fontWeight: 700,
          fontSize: '0.875rem',
          color: getRoleColor(displayRole),
          borderColor: getRoleColor(displayRole),
          backgroundColor: getRoleBackground(displayRole),
          cursor: disabled ? 'default' : 'pointer',
          height: 32,
          '&:hover': {
            backgroundColor: getRoleBackground(displayRole).replace('22', '33'),
          },
        }}
      />
      {!disabled && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          PaperProps={{ style: { minWidth: 120 } }}
        >
          {roles.map((role) => (
            <MenuItem
              key={role.id}
              selected={role.name === displayRole}
              onClick={() => handleClose(role.name)}
              sx={{
                fontSize: '0.875rem',
                minHeight: 32,
                justifyContent: 'flex-start'
              }}
            >
              {role.name}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}

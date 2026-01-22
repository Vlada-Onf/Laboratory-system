import React from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';

const roles = ['Admin', 'Lab'];

const roleColors = {
  Admin: '#f16731',
  Lab: '#5bc522',
};

export default function RoleChip({ role: initialRole, onChange }) {
  const [role, setRole] = React.useState(initialRole);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newRole) => {
    if (newRole) {
      setRole(newRole);

      if (onChange) {
        onChange(newRole);
      }
    }

    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        label={role}
        onClick={handleClick}
        variant="outlined"
        sx={{
          fontWeight: 700,
          color: roleColors[role],
          borderColor: roleColors[role],
          backgroundColor: `${roleColors[role]}22`,
          cursor: 'pointer',
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{ style: { minWidth: 100 } }}
      >
        {roles.map((r) => (
          <MenuItem
            key={r}
            selected={r === role}
            onClick={() => handleClose(r)}
          >
            {r}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

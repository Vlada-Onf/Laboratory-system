import React from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';

const statuses = ['В очікуванні', 'Затверджено', 'Відмовлено'];

const statusColors = {
  'В очікуванні': '#f16731',
  'Затверджено': '#5bc522',
  'Відмовлено': '#d32f2f',
};

const StatusChip = ({ status: initialStatus, onChange }) => {
  const [status, setStatus] = React.useState(initialStatus);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = (newStatus) => {
    if (newStatus) {
      setStatus(newStatus);
      onChange?.(newStatus);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        label={status}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          fontWeight: 700,
          color: statusColors[status],
          borderColor: statusColors[status],
          backgroundColor: `${statusColors[status]}22`,
        }}
        variant="outlined"
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
        {statuses.map((s) => (
          <MenuItem
            key={s}
            selected={s === status}
            onClick={() => handleClose(s)}
          >
            {s}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default StatusChip;

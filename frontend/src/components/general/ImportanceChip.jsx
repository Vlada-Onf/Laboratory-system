import React from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';

const priorities = ['Низька', 'Середня', 'Висока'];

const priorityColors = {
  'Низька': '#5bc522',
  'Середня': '#f16731',
  'Висока': '#d32f2f',
};

const PriorityChip = ({ priority: initialPriority, onChange }) => {
  const [priority, setPriority] = React.useState(initialPriority);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = (newPriority) => {
    if (newPriority) {
      setPriority(newPriority);
      onChange?.(newPriority);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        label={priority}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          fontWeight: 700,
          color: priorityColors[priority],
          borderColor: priorityColors[priority],
          backgroundColor: `${priorityColors[priority]}22`,
        }}
        variant="outlined"
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
        {priorities.map((p) => (
          <MenuItem
            key={p}
            selected={p === priority}
            onClick={() => handleClose(p)}
          >
            {p}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default PriorityChip;

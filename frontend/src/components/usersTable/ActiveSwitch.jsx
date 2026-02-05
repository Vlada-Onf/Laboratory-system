import React from 'react';
import { Switch } from '@mui/material';

const ActiveSwitch = ({ active, onChange }) => {
  const [checked, setChecked] = React.useState(active);

  const handleChange = (e) => {
    setChecked(e.target.checked);

    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#5bc522',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#5bc522',
        },
      }}
    />
  );
};

export default ActiveSwitch;

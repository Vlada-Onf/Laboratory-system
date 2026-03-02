import { Box } from '@mui/material';

const ColorPicker = ({ value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{width: 32,height: 32,borderRadius: 1,border: '1px solid #ccc',backgroundColor: value,}}/>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ height: 32, border: 'none', cursor: 'pointer' }}
      />
    </Box>
  );
};

export default ColorPicker;

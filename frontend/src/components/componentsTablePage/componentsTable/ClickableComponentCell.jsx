import { Box, Avatar, Typography } from '@mui/material';

const ClickableComponentCell = ({ image, name, id, onClick }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick && onClick(id)}
    >
      <Avatar
        src={image || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
        alt={name || '—'}
        variant="rounded"
        sx={{ width: 60, height: 60, mr: 2 }}
      />
      <Typography fontWeight={600}>{name || '—'}</Typography>
    </Box>
  );
};

export default ClickableComponentCell;

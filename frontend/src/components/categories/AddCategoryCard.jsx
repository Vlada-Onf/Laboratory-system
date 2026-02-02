import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddCategoryCard = ({ onClick }) => {
  const customColor = '#08273b';

  return (
    <Card
      sx={{
        width: 300,
        height: 240,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed #999',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box textAlign="center">
        <IconButton sx={{ color: customColor }}>
          <AddIcon fontSize="large" sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="h6" sx={{ color: customColor }}>
          Додати категорію
        </Typography>
      </Box>
    </Card>
  );
};

export default AddCategoryCard;

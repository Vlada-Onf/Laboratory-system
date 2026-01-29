import React from 'react';
import { Box, Button } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';

const ComponentsTableToolbar = ({ onImportExcel, onAddComponent }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      mb={2}
    >
      <Button
        variant="contained"
        onClick={onAddComponent}
        sx={{
          backgroundColor: '#841a1c',
          '&:hover': {
            backgroundColor: '#6e1518',
          },
        }}
      >
        Додати компонент
      </Button>

      <Button
        variant="outlined"
        startIcon={<TableViewIcon />}
        onClick={onImportExcel}
        sx={{
          borderColor: '#2e7d32',
          color: '#2e7d32',
          '&:hover': {
            borderColor: '#1b5e20',
            backgroundColor: 'rgba(46, 125, 50, 0.04)',
          },
        }}
      >
        Імпорт в Excel
      </Button>
    </Box>
  );
};

export default ComponentsTableToolbar;

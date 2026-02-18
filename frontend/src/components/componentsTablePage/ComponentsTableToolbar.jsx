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
          fontSize: 16,
          background: 'linear-gradient(135deg, #f16731, #f4926c)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #ad4a23, #d07f5e)',
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
           fontSize: 16,
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

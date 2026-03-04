import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ComponentsTableToolbar = ({ onAddComponent, onExportExcel }) => {
  return (
    <Box display="flex" justifyContent="space-between" mb={2} gap={{ xs: 2, sm: 0 }}>
      <Button
        variant="contained"
        onClick={onAddComponent}
        sx={{
          fontSize: { xs: 14, sm: 15, md: 16 },
          background: 'linear-gradient(135deg, #f16731, #f4926c)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #ad4a23, #d07f5e)',
          },
        }}
      >
        Додати компонент
      </Button>

      <Box>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={onExportExcel}
          sx={{
            fontSize: { xs: 14, sm: 15, md: 16 },
            background: 'linear-gradient(135deg, #39830e, #5bc522)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #326713, #429018)',
            },
          }}
        >
          Експортувати в Excel
        </Button>
      </Box>
    </Box>
  );
};

export default ComponentsTableToolbar;

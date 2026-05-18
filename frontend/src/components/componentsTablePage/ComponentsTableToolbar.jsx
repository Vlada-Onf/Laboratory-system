import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from 'react';
import AiImportModal from './AiImportModal';

const ComponentsTableToolbar = ({ onAddComponent, onExportExcel }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleOpenAiModal = () => setIsAiModalOpen(true);
  const handleCloseAiModal = () => setIsAiModalOpen(false);

  return (
    <Box display="flex" justifyContent="space-between" mb={2} gap={2} flexWrap="wrap">

      <Box display="flex" gap={2}>
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

        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOpenAiModal}
          sx={{
            fontSize: { xs: 14, sm: 15, md: 16 },
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #480ca8, #1a5fdb)',
            },
          }}
        >
          AI Імпорт
        </Button>
      </Box>

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

      <AiImportModal
        key={isAiModalOpen ? 'open' : 'closed'}
        open={isAiModalOpen}
        onClose={handleCloseAiModal}
      />
    </Box>
  );
};

export default ComponentsTableToolbar;
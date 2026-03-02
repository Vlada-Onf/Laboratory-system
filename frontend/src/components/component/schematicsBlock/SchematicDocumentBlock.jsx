import { Box, Typography, Button } from '@mui/material';

const SchematicDocumentBlock = ({ schematic }) => {
  if (!schematic.documentUrl) {
    return null;
  }

  return (
    <Box sx={{
      mt: 3,
      p: 3,
      bgcolor: '#08273b',
      borderRadius: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2
    }}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          📄 Документ
        </Typography>
      </Box>
      <Button
        variant="contained"
        href={schematic.documentUrl}
        target="_blank"
        size="small"
        sx={{
          minWidth: 120,
          height: 36,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          backgroundColor: '#f16731',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            transform: 'translateY(-1px)'
          }
        }}
      >
        Завантажити
      </Button>
    </Box>
  );
};

export default SchematicDocumentBlock;

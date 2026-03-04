import { Card, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

const AddSchematicCard = ({ onAdd }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b';

  return (
    <Card
      sx={{
        width: { xs: 260, sm: 320 },
          height: { xs: 230, sm: 240 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#999',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
      onClick={onAdd}
    >
      <Box textAlign="center" sx={{ p: 2 }}>
        <IconButton sx={{
          color: textColor,
          fontSize: 40,
          mb: 1
        }}>
          <AddIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography
          variant="h6"
          fontWeight={500}
          sx={{
            color: textColor,
            textAlign: 'center',
          }}
        >
          Додати схему
        </Typography>
      </Box>
    </Card>
  );
};

export default AddSchematicCard;

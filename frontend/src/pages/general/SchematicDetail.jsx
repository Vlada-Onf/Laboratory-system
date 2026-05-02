import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSchematicsStore } from '../../store/useSchematicsStore';
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PageWrapper from '../../components/layout/PaperWrapper';
import SchematicHeader from '../../components/component/schematicsBlock/SchematicHeader';
import SchematicImage from '../../components/component/schematicsBlock/SchematicImage';
import SchematicDocumentBlock from '../../components/component/schematicsBlock/SchematicDocumentBlock';
import SchematicLinksBlock from '../../components/component/schematicsBlock/SchematicLinksBlock';
import { useTheme } from '@mui/material/styles';

const SchematicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { currentComponent, fetchComponents } = useComponentsStore();
  const { schematics, fetchSingleSchematic, isLoading } = useSchematicsStore();

  React.useEffect(() => {
    if (id) {
      fetchSingleSchematic(id).catch(console.error);
      fetchComponents();
    }
  }, [id, fetchSingleSchematic, fetchComponents]);

  const schematic = schematics.find(s => s.id === id) || (currentComponent?.schematics || []).find(s => s.id === id);

  const schematicsList = schematic?.componentId
    ? schematics.filter(s => String(s.componentId) === String(schematic.componentId))
    : [];

  const currentIndex = schematicsList.findIndex(s => String(s.id) === String(id));

  const prevSchematic = currentIndex > 0 ? schematicsList[currentIndex - 1] : null;
  const nextSchematic = currentIndex !== -1 && currentIndex < schematicsList.length - 1 ? schematicsList[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevSchematic) {
      navigate(`/front-schematics/${prevSchematic.id}`);
    }
  };

  const handleNext = () => {
    if (nextSchematic) {
      navigate(`/front-schematics/${nextSchematic.id}`);
    }
  };

  if (isLoading || !schematic) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography mt={2}>Завантажуємо схему...</Typography>
      </Box>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 6 }, py: 4, position: 'relative' }}>

       <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosIcon />}
            onClick={handlePrev}
            disabled={!prevSchematic}
            sx={{
          mb: 3,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,

          '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },

          '&:active, &:focus': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
          },
        }}
          >
            Попередня
          </Button>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{fontSize: 17, fontWeight: 500,  mt: -2.5 }}>
            Схема: {currentIndex !== -1 ? currentIndex + 1 : 'X'} із {schematicsList.length}
          </Typography>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleNext}
            disabled={!nextSchematic}
            sx={{
          mb: 3,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,

          '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },

          '&:active, &:focus': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
          },
        }}
          >
            Наступна
          </Button>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            sx={{
              position: 'fixed',
              left: { md: '150px' },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={handlePrev}
              disabled={!prevSchematic}
              sx={{
           width: 58,
                height: 58,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,
          border: '2px solid',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,

          '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },

          '&:active, &:focus': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
          },
        }}
            >
              <ArrowBackIosIcon fontSize="small" sx={{ ml: 0.5 }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              position: 'fixed',
              right: { md: 32, lg: 64 },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={handleNext}
              disabled={!nextSchematic}
              sx={{
          width: 58,
                height: 58,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,
          border: '2px solid',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined,

          '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : undefined,
          },

          '&:active, &:focus': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
            color: isDarkMode ? 'rgba(255, 255, 255, 1)' : undefined,
          },
        }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <SchematicHeader
          schematic={schematic}
          currentComponent={currentComponent}
          navigate={navigate}
        />

        <SchematicImage
          photoUrl={schematic.photoUrl}
          title={schematic.title}
        />

        <SchematicDocumentBlock schematic={schematic} />
        <SchematicLinksBlock schematic={schematic} />
      </Box>
    </PageWrapper>
  );
};

export default SchematicDetail;
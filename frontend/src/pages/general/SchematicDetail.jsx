import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSchematicsStore } from '../../store/useSchematicsStore';
import { Box, Typography, CircularProgress } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import SchematicHeader from '../../components/component/schematicsBlock/SchematicHeader';
import SchematicImage from '../../components/component/schematicsBlock/SchematicImage';
import SchematicDocumentBlock from '../../components/component/schematicsBlock/SchematicDocumentBlock';
import SchematicLinksBlock from '../../components/component/schematicsBlock/SchematicLinksBlock';

const SchematicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentComponent, fetchComponents } = useComponentsStore();
  const { schematics, fetchSingleSchematic, isLoading } = useSchematicsStore();

  React.useEffect(() => {
    if (id) {
      fetchSingleSchematic(id).catch(console.error);
      fetchComponents();
    }
  }, [id, fetchSingleSchematic, fetchComponents]);

  const schematic = schematics.find(s => s.id === id) || (currentComponent?.schematics || []).find(s => s.id === id);

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
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
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

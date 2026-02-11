import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSchematicsStore } from '../../store/useSchematicStore';
import { Box, Typography, CircularProgress } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';

import SchematicHeader from '../../components/component/schematicsBlock/SchematicHeader';
import SchematicImage from '../../components/component/schematicsBlock//SchematicImage';
import SchematicLinksBlock from '../../components/component/schematicsBlock/SchematicLinksBlock';

const SchematicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentComponent } = useComponentsStore();
  const { schematics } = useSchematicsStore();

  const schematic = schematics.find(s => s.id == id);

  const loading = schematics.length === 0;

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  }

  if (!schematic) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h5">Схема не знайдена (ID: {id})</Typography>
        <Typography variant="body2" color="text.secondary">
          Доступні ID: {schematics.map(s => `${s.id}(${typeof s.id})`).join(', ')}
        </Typography>
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

      <SchematicLinksBlock schematic={schematic} />
    </Box>
    </PageWrapper>

  );
};

export default SchematicDetail;

import React from 'react';
import { Box } from '@mui/material';
import ComponentsTable from '../../components/componentsTablePage/componentsTable/ComponentsTable';
import { useNeedsStore } from '../../store/useNeedsStore';
import PageWrapper from '../../components/layout/PaperWrapper';

const Components = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <PageWrapper>
      <Box sx={{ p: 2, width: '100%' }}>
        <ComponentsTable onAddNeed={addNeed} />
      </Box>
    </PageWrapper>
  );
};

export default Components;

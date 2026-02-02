import React from 'react';
import { Box, Typography } from '@mui/material';
import ComponentsTable from '../../components/componentsTablePage/componentsTable/ComponentsTable';
import { useNeedsStore } from '../../store/useNeedsStore';

const Components = () => {
  const addNeed = useNeedsStore((state) => state.addNeed);

  return (
    <Box p={3}>
      <ComponentsTable onAddNeed={addNeed} />
    </Box>
  );
};

export default Components;

import React, { useEffect, memo } from 'react';
import { Box, CssBaseline } from '@mui/material';
import SearchResults from '../general/SearchResults';
import { useComponentsStore } from '../../store/useComponentsStore';
import { useSchematicsStore } from '../../store/useSchematicsStore';

const LayoutWithSearch = memo(({ children }) => {

  useEffect(() => {
    const loadSequentially = async () => {
      const componentsStore = useComponentsStore.getState();
      
      if (typeof componentsStore.fetchComponents === 'function' && componentsStore.components.length === 0) {
        await componentsStore.fetchComponents();
      }

      const schematicsStore = useSchematicsStore.getState();
      if (typeof schematicsStore.fetchAllSchematicsForSearch === 'function') {
        schematicsStore.fetchAllSchematicsForSearch();
      }
    };

    loadSequentially().catch(console.error);
  }, []);


  return (
    <>
      <CssBaseline />

      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        pt: '72px'
      }}>
        {children}
      </Box>

    </>
  );
});

LayoutWithSearch.displayName = 'LayoutWithSearch';
export default LayoutWithSearch;

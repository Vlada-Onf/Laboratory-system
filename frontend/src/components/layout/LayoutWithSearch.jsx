import { memo } from 'react';
import { Box, CssBaseline } from '@mui/material';

const LayoutWithSearch = memo(({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        pt: '40px'
      }}>
        {children}
      </Box>
    </>
  );
});

LayoutWithSearch.displayName = 'LayoutWithSearch';
export default LayoutWithSearch;

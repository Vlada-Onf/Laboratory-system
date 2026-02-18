import { Box, CssBaseline } from '@mui/material';
import HeaderSearch from './header/HeaderSearch';
import SearchResults from '../general/SearchResults';
import { useSearchStore } from '../../store/useSearchStore';

const LayoutWithSearch = ({ children }) => {
  const { searchResults, isSearching } = useSearchStore();

  return (
    <>
      <CssBaseline />
      
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1200, 
        bgcolor: 'background.default' 
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <HeaderSearch />
        </Box>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {children}
      </Box>

      {isSearching && searchResults.length > 0 && (
        <Box sx={{ 
          position: 'fixed', 
          top: 70,
          left: 0, 
          right: 0, 
          zIndex: 1300,
          mx: 'auto',
          maxWidth: 1200,
          pointerEvents: 'none',
          pb: 2
        }}>
          <Box sx={{ width: '100%', pointerEvents: 'auto' }}>
            <SearchResults results={searchResults} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default LayoutWithSearch;

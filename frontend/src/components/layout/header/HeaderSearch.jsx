import React, { useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchStore } from '../../../store/useSearchStore';
import SearchResults from '../../general/SearchResults';

const SearchContainer = styled('div')(() => ({
  position: 'relative',
  display: 'inline-block'
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' },
  },
}));

const ClearButton = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  fontSize: '18px',
  padding: '4px',
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

export default function HeaderSearch() {
  const searchQuery = useSearchStore(state => state.searchQuery);
  const setSearchQuery = useSearchStore(state => state.setSearchQuery);
  const isSearching = useSearchStore(state => state.isSearching);
  const searchResults = useSearchStore(state => state.searchResults);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  
  return (
    <SearchContainer>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase 
          placeholder="Компонент або схема..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        
      </Search>
      
      {isSearching && searchResults?.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1.6,
            zIndex: 1301,
          }}
        >
          <SearchResults results={searchResults} />
        </Box>
      )}
    </SearchContainer>
  );
}

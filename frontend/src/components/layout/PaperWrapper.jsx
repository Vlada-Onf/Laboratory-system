import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '../../context/useTheme';
import bgImage from '../../assets/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner.webp';

const PageWrapper = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <Box sx={{ position: 'relative' }} data-page-wrapper>
      {isDarkMode && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0b1c2d',
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          }}
        />
      )}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;

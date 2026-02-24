import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';

const Blocked = () => {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <PageWrapper className="no-search">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: 2,
            maxWidth: 400,
            transform: 'translateY(-60px)',
          }}
        >
          <Typography
            sx={{ fontSize: '26px', mb: 4 }}
          >
            Ваш акаунт заблоковано адміністратором системи.
          </Typography>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Blocked;

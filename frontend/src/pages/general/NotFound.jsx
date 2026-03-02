import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PaperWrapper';

const NotFound = () => {
  const navigate = useNavigate();

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
            variant="h1"
            fontWeight={100}
            sx={{ fontSize: '120px', lineHeight: 1.05 }}
          >
            404
          </Typography>

          <Typography
            sx={{ fontSize: '26px', mb: 4 }}
          >
            Сторінку не знайдено
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: '#b33a0b', '&:hover': { backgroundColor: '#9e3208' } }}
            onClick={() => navigate('/main')}
            size="large"
          >
            На головну
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default NotFound;

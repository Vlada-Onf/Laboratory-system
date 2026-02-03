import React from 'react';
import { useEffect } from 'react';
import { Box, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import bgImage from "../../assets/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner.webp";

const NotFound = () => {
  const navigate = useNavigate();



  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b1c2d',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          color: '#fff',
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
  );
};

export default NotFound;

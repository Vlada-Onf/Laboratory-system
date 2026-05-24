import { Box, Typography, Grid } from '@mui/material';
import PageWrapper from '../../components/layout/PaperWrapper';
import { useTheme as useCustomTheme } from '../../context/useTheme';

const MainLayout = ({ title, topRightContent, bottomContent }) => {
  const { isDarkMode } = useCustomTheme();

  return (
    <PageWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: { xs: 3, md: 5 },
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: 0,
            animation: 'fadeUp 0.8s ease-out forwards',
            '@keyframes fadeUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h1"
            fontWeight={500}
            sx={{
              fontSize: { xs: '32px', sm: '56px', md: '64px', lg: '72px' },
              lineHeight: 1.2,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          alignItems="stretch"
          sx={{
            width: '100%',
            margin: 0,
            '& .MuiGrid-item': { pl: { xs: 0, md: 5 }, pt: { xs: 3, md: 5 } }
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              opacity: 0,
              animation: 'fadeUp 0.8s ease-out forwards',
              animationDelay: '0.2s',
            }}
          >
             <Box sx={{ width: { xs: '100%', md: '600px' }, height: '100%' }}>
              {bottomContent}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              opacity: 0,
              animation: 'fadeUp 0.8s ease-out forwards',
              animationDelay: '0.4s',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                pr: 0.5,
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '4px',
                },
              }}
            >
              {topRightContent}
            </Box>
          </Grid>
        </Grid>

      </Box>
    </PageWrapper>
  );
};

export default MainLayout;
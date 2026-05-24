import { Box, Typography } from '@mui/material';
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
          gap: 3,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box
            sx={{
              flex: 1.2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
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
                fontSize: { xs: '48px', sm: '72px', md: '76px', lg: '96px' },
                lineHeight: 1.1,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#08273b',
              }}
            >
              {title}
            </Typography>
          </Box>

          {topRightContent && (
            <Box
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                opacity: 0,
                animation: 'fadeUp 0.8s ease-out forwards',
                animationDelay: '0.2s',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', md: '450px' },
                  maxHeight: { xs: 'none', md: '280px' },
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  pr: 0.5,

                  '&::-webkit-scrollbar': {
                    width: '5px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '4px',
                  },
                }}
              >
                {topRightContent}
              </Box>
            </Box>
          )}
        </Box>

        {bottomContent && (
          <Box
            sx={{
              width: '100%',
              opacity: 0,
              animation: 'fadeUp 0.8s ease-out forwards',
              animationDelay: '0.4s',
            }}
          >
            {bottomContent}
          </Box>
        )}
      </Box>
    </PageWrapper>
  );
};

export default MainLayout;
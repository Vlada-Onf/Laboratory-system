import { createTheme } from '@mui/material/styles';

const createAppTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#08273b',
    },
    background: {
      default: isDarkMode ? 'rgba(11, 28, 45, 0.9)' : '#f5f5f5',
      paper: isDarkMode ? 'rgba(1, 37, 57, 0.75)' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
      secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#08273b !important',
          color: 'rgba(255, 255, 255, 0.9) !important',
          boxShadow: 'none !important',
          '& .MuiTypography-root': {
            color: 'rgba(255, 255, 255, 0.95) !important',
          },
          '& .MuiIconButton-root': {
            color: 'rgba(255, 255, 255, 0.9) !important',
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          ...(isDarkMode && {
            color: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }),
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' ? {
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(8, 39, 59, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          } : {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
          }),
        }),
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: {
          ...(isDarkMode && {
            backgroundColor: 'rgba(8, 39, 59, 0.35)',
            color: '#fff',
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4,
              backgroundColor: 'rgba(8, 39, 59, 0.35)',
              color: 'rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'rgba(8, 39, 59, 0.98)',
              color: 'rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'rgba(8, 39, 59, 0.35)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.9)',
              '& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
              '& .MuiSelect-select, & svg': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(8, 39, 59)',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'rgba(255, 255, 255, 0)',
            },
          }),
        },
      },
    },
  },

  typography: {
    fontFamily: 'Geologica, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontWeight: 400, fontSize: '1rem' },
    button: { fontWeight: 500, textTransform: 'none' },
  },
});

export default createAppTheme;

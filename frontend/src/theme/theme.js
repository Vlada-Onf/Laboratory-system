import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Geologica, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontWeight: 400, fontSize: '1rem' },
    button: { fontWeight: 500, textTransform: 'none' },
  },
});

export default theme;

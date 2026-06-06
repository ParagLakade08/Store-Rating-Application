import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:    { main: '#1976d2' },
    secondary:  { main: '#dc004e' },
    background: { default: '#f4f6f8' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton:  { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard:    { styleOverrides: { root: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } } },
    MuiPaper:   { styleOverrides: { root: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' } } },
    MuiDrawer:  { styleOverrides: { paper: { borderRight: 'none' } } },
  },
});

export default theme;

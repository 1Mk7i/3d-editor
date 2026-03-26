'use client';
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#5a9fd4' },
    background: { default: '#121212', paper: '#1e1e1e' },
    divider: 'rgba(255, 255, 255, 0.12)',
    editor: {
      sceneBackground: '#1a1a1a',
      grid: '#333333',
      panelBorder: 'rgba(255, 255, 255, 0.12)',
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});
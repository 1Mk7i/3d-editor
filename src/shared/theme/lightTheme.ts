'use client';

import { createTheme, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    editor: {
      sceneBackground: string;
      grid: string;
      panelBorder: string;
    };
  }
  interface PaletteOptions {
    editor?: {
      sceneBackground?: string;
      grid?: string;
      panelBorder?: string;
    };
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1b',
      secondary: '#5f6368',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    
    editor: {
      sceneBackground: '#f0f0f0',
      grid: '#d1d1d1',
      panelBorder: '#e0e0e0',
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a1b',
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default lightTheme;
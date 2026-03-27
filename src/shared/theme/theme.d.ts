import '@mui/material/styles';

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
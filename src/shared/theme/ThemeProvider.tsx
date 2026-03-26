'use client';

import React, { useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from '@/shared/theme/theme';
import { lightTheme } from '@/shared/theme/lightTheme';
import { useSettings } from '@/hooks/useSettings';
import { useMediaQuery } from '@mui/material';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, isLoaded } = useSettings();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const activeTheme = useMemo(() => {
    if (!isLoaded || settings.theme === 'dark') return darkTheme;
    if (settings.theme === 'light') return lightTheme;
    
    return prefersDarkMode ? darkTheme : lightTheme;
  }, [settings.theme, prefersDarkMode, isLoaded]);

  return (
    <MUIThemeProvider theme={activeTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </MUIThemeProvider>
  );
};
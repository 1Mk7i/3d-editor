'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './theme';
import { lightTheme } from './lightTheme';
import { useSettings } from '@/hooks/useSettings';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings } = useSettings();
  const [currentTheme, setCurrentTheme] = useState(darkTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Оновлюємо тему одразу при зміні settings.theme
  useEffect(() => {
    if (!isMounted) return;

    // Очищаємо попередній listener для auto теми
    let mediaQuery: MediaQueryList | null = null;
    let handleChange: ((e: MediaQueryListEvent) => void) | null = null;

    // Оновлюємо тему одразу при зміні settings.theme
    if (settings.theme === 'dark') {
      setCurrentTheme(darkTheme);
    } else if (settings.theme === 'light') {
      setCurrentTheme(lightTheme);
    } else {
      // auto - використовуємо системну тему
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(prefersDark ? darkTheme : lightTheme);

        // Слухаємо зміни системної теми
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        handleChange = (e: MediaQueryListEvent) => {
          setCurrentTheme(e.matches ? darkTheme : lightTheme);
        };
        mediaQuery.addEventListener('change', handleChange);
      }
    }

    return () => {
      if (mediaQuery && handleChange) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [settings.theme, isMounted, settings]); // Додаємо settings для гарантії оновлення

  // На сервері завжди використовуємо darkTheme для узгодженості
  // Це гарантує, що сервер та клієнт рендерять однакову тему до монтування
  // Використовуємо useMemo для стабільності посилання на тему
  const themeToUse = useMemo(() => {
    if (!isMounted) return darkTheme;
    return currentTheme;
  }, [isMounted, currentTheme]);

  // Не рендеримо CssBaseline на сервері, щоб уникнути hydration mismatch
  // Використовуємо key для форсування оновлення теми
  return (
    <MUIThemeProvider theme={themeToUse} key={`theme-${settings.theme}-${isMounted}`}>
      {isMounted && <CssBaseline enableColorScheme />}
      {children}
    </MUIThemeProvider>
  );
};



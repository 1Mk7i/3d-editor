'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для роботи з повноекранним режимом браузера
 * @returns {object} Об'єкт зі станом та функціями для керування повноекранним режимом
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Перевірка, чи підтримується Fullscreen API
  const isSupported = typeof window !== 'undefined' && (
    document.documentElement.requestFullscreen ||
    (document.documentElement as any).webkitRequestFullscreen ||
    (document.documentElement as any).mozRequestFullScreen ||
    (document.documentElement as any).msRequestFullscreen
  );

  // Отримання префіксованого методу для виходу з повноекранного режиму
  const getExitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      return (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      return (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      return (document as any).msExitFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API не підтримується'));
  }, []);

  // Отримання префіксованого методу для входу в повноекранний режим
  const getRequestFullscreen = useCallback((element: HTMLElement) => {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      return (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      return (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      return (element as any).msRequestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API не підтримується'));
  }, []);

  // Перевірка поточного стану повноекранного режиму
  const checkFullscreen = useCallback(() => {
    const isFullscreenElement = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    setIsFullscreen(isFullscreenElement);
  }, []);

  // Вхід в повноекранний режим
  const enterFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('Fullscreen API не підтримується в цьому браузері');
      return;
    }

    try {
      // Перевірка дозволів перед входом в повноекранний режим
      if (document.fullscreenEnabled !== undefined && !document.fullscreenEnabled) {
        console.warn('Повноекранний режим не дозволений');
        return;
      }

      await getRequestFullscreen(document.documentElement);
      setIsFullscreen(true);
    } catch (error: any) {
      // Ігноруємо помилки дозволів (наприклад, якщо користувач не натиснув кнопку)
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        console.log('Вхід в повноекранний режим потребує взаємодії користувача');
      } else {
        console.error('Помилка при вході в повноекранний режим:', error);
      }
    }
  }, [isSupported, getRequestFullscreen]);

  // Вихід з повноекранного режиму
  const exitFullscreen = useCallback(async () => {
    if (!isSupported) {
      return;
    }

    try {
      await getExitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.error('Помилка при виході з повноекранного режиму:', error);
    }
  }, [isSupported, getExitFullscreen]);

  // Перемикання повноекранного режиму
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Відстеження змін стану повноекранного режиму
  useEffect(() => {
    if (!isSupported) return;

    // Перевіряємо початковий стан
    checkFullscreen();

    // Обробники подій для різних браузерів
    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isSupported, checkFullscreen]);

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
};



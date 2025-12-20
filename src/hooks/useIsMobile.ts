'use client';

import { useState, useEffect } from 'react';

/**
 * Хук для визначення, чи користувач використовує мобільний пристрій
 * @returns {boolean} true, якщо пристрій мобільний
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Функція для перевірки мобільного пристрою
    const checkIsMobile = () => {
      // Перевірка ширини екрану (менше 768px вважається мобільним)
      const isMobileWidth = window.innerWidth < 768;
      
      // Перевірка User Agent для мобільних пристроїв
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      
      // Перевірка touch-подій
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Вважаємо мобільним, якщо виконується хоча б одна умова
      setIsMobile(isMobileWidth || (isMobileUA && isTouchDevice));
    };

    // Перевірка при монтуванні
    checkIsMobile();

    // Перевірка при зміні розміру вікна
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('orientationchange', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  return isMobile;
};



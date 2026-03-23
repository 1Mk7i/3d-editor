'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export const useContextMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Реф для самого елемента меню (передамо його в компоненту)
  const menuRef = useRef<HTMLDivElement | null>(null);

  const showContextMenu = useCallback((event: React.MouseEvent | MouseEvent | TouchEvent) => {
    // Зупиняємо стандартне меню браузера
    event.preventDefault();
    
    let x, y;
    
    // Визначаємо координати (для тачу або миші)
    if ('clientX' in event) {
      x = event.clientX;
      y = event.clientY;
    } else {
      // Для мобільних (перший палець)
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    }

    setPosition({ x, y });
    setIsVisible(true);
  }, []);

  const hideContextMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handlePointerDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
      // Перевіряємо, чи клік був ПОЗА межами меню
      // Якщо menuRef.current існує і клік (target) НЕ всередині нього — закриваємо
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hideContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideContextMenu();
    };

    // Використовуємо pointerdown (це і миша, і тач, і стилус)
    // capture: true допомагає зловити подію раніше за інші елементи
    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, hideContextMenu]);

  return {
    isVisible,
    position,
    showContextMenu,
    hideContextMenu,
    menuRef, // Обов'язково прокинь цей реф у ваш <div> меню
  };
};
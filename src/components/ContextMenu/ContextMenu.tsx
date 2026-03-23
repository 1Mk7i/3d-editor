'use client';

import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ContextMenuProvider, useContextMenu, ContextMenuItem } from './ContextMenuContext';
import { MenuItem } from './MenuItem';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenuContent: React.FC<ContextMenuProps> = ({ position, items, onClose }) => {
  const { submenuStack, closeAll } = useContextMenu();

  // 1. Блокуємо скрол сторінки, поки меню відкрите (критично для мобільних)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 2. Розрахунок безпечної позиції (щоб не вилітало за краї)
  const safePosition = useMemo(() => {
    if (typeof window === 'undefined') return position;

    const vW = window.innerWidth;
    const vH = window.innerHeight;
    const expectedWidth = 220; // приблизна ширина меню
    const expectedHeight = items.length * 38; // приблизна висота (к-сть пунктів * висоту рядка)
    const padding = 10;

    let x = position.x;
    let y = position.y;

    // Якщо меню виходить за правий край
    if (x + expectedWidth > vW - padding) {
      x = vW - expectedWidth - padding;
    }
    // Якщо меню виходить за нижній край
    if (y + expectedHeight > vH - padding) {
      y = vH - expectedHeight - padding;
    }

    return { 
      x: Math.max(padding, x), 
      y: Math.max(padding, y) 
    };
  }, [position, items]);

  // 3. Закриття по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeAll]);

  return (
    <>
      {/* Бекдроп: використовуємо onPointerDown для миттєвої реакції на тач */}
      <div 
        className={styles['context-menu-backdrop']} 
        onPointerDown={(e) => {
          e.preventDefault();
          closeAll();
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          backgroundColor: 'transparent',
          touchAction: 'none' // забороняємо зум/скрол сцени під меню
        }}
      />

      {/* Головне меню */}
      <div
        className={styles['context-menu']}
        onPointerDown={(e) => e.stopPropagation()} // Зупиняємо подію, щоб не спрацював бекдроп
        style={{ 
          left: safePosition.x, 
          top: safePosition.y, 
          position: 'fixed', 
          zIndex: 10000,
          touchAction: 'none'
        }}
      >
        <div className={styles['context-menu-content']}>
          {items.map(item => (
            <MenuItem key={item.id} item={item} level={0} />
          ))}
        </div>
      </div>

      {/* Підменю через Portal */}
      {submenuStack.map(sub => (
        createPortal(
          <div
            key={sub.id}
            className={`${styles['context-menu']} ${styles.submenu}`}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ 
              left: sub.position.x, 
              top: sub.position.y, 
              position: 'fixed', 
              zIndex: 10000 + sub.level,
              maxHeight: sub.maxHeight,
              touchAction: 'none'
            }}
          >
            <div 
              className={styles['context-menu-content']} 
              style={{ maxHeight: 'inherit', overflowY: 'auto' }}
            >
              {sub.items.map(item => (
                <MenuItem key={item.id} item={item} level={sub.level} />
              ))}
            </div>
          </div>,
          document.body
        )
      ))}
    </>
  );
};

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  if (!props.isVisible) return null;

  return (
    <ContextMenuProvider onClose={props.onClose}>
      <ContextMenuContent {...props} />
    </ContextMenuProvider>
  );
};
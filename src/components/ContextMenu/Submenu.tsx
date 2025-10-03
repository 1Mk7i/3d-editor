'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ContextMenuItem } from './ContextMenu';
import styles from './ContextMenu.module.css';

interface SubmenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  level: number;
  onClose: () => void;
  onItemHover: (item: ContextMenuItem, event: React.MouseEvent) => void;
  onItemLeave: (item: ContextMenuItem) => void;
  onItemClick: (item: ContextMenuItem, event: React.MouseEvent) => void;
}

export const Submenu: React.FC<SubmenuProps> = ({
  isVisible,
  position,
  items,
  level,
  onClose,
  onItemHover,
  onItemLeave,
  onItemClick,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isSubmenuClick = menuRef.current && menuRef.current.contains(target);
      const isContextMenuItem = target.closest('.context-menu-item') !== null;
      
      // Якщо це клік на пункті меню, не закриваємо меню
      if (isContextMenuItem) {
        return;
      }
      
      if (!isSubmenuClick) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible && menuRef.current) {
      // Тимчасово приберемо цей useEffect, щоб уникнути подвійного встановлення позиції
      console.log('Submenu rendered with position:', position);
    }
  }, [isVisible, position]);

  const renderMenuItem = (item: ContextMenuItem) => {
    console.log('Rendering submenu item:', item.label, 'onClick exists:', !!item.onClick);
    
    if (item.separator) {
      return <div key={item.id} className={styles['context-menu-separator']} />;
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div
        key={item.id}
        className={`${styles['context-menu-item']} ${item.disabled ? styles.disabled : ''} ${item.danger ? styles.danger : ''}`}
        data-has-submenu={hasSubmenu ? 'true' : 'false'}
        onMouseDown={(e) => {
          console.log('=== SUBMENU ITEM MOUSE DOWN ===');
          console.log('Item:', item);
          console.log('Item label:', item.label);
          console.log('Item onClick exists:', !!item.onClick);
          console.log('Event:', e);
          e.preventDefault();
          e.stopPropagation();
          console.log('About to call onItemClick...');
          onItemClick(item, e as any);
          console.log('onItemClick called');
        }}
        onClick={(e) => {
          console.log('=== SUBMENU ITEM CLICKED ===');
          console.log('Item:', item);
          console.log('Item label:', item.label);
          console.log('Item onClick exists:', !!item.onClick);
          console.log('Event:', e);
          e.stopPropagation();
          console.log('About to call onItemClick...');
          onItemClick(item, e);
          console.log('onItemClick called');
        }}
        onMouseEnter={(e) => onItemHover(item, e)}
        onMouseLeave={() => onItemLeave(item)}
        style={{ 
          cursor: 'pointer',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <div className={styles['context-menu-item-content']}>
          {item.icon && <span className={styles['context-menu-icon']}>{item.icon}</span>}
          {item.label && <span className={styles['context-menu-label']}>{item.label}</span>}
          {item.shortcut && <span className={styles['context-menu-shortcut']}>{item.shortcut}</span>}
          {hasSubmenu && <span className={styles['context-menu-arrow']}>▶</span>}
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  const menuElement = (
    <div
      ref={menuRef}
      className={`${styles['context-menu']} ${styles.submenu}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 10000 + level,
      }}
    >
      <div className={styles['context-menu-content']}>
        {items.map(renderMenuItem)}
      </div>
    </div>
  );

  // Рендеримо через портал до body
  if (typeof window !== 'undefined') {
    return createPortal(menuElement, document.body);
  }

  return null;
};

export default Submenu;

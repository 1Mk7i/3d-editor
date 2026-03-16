'use client';

import React, { useRef } from 'react';
import { ContextMenuItem, useContextMenu } from './ContextMenuContext';
import styles from './ContextMenu.module.css';

interface MenuItemProps {
  item: ContextMenuItem;
  level: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, level }) => {
  const { openSubmenu, closeAll } = useContextMenu();
  const itemRef = useRef<HTMLDivElement>(null);

  if (item.separator) return <div className={styles['context-menu-separator']} />;

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleMouseEnter = () => {
    if (hasSubmenu && itemRef.current) {
      openSubmenu(item, itemRef.current.getBoundingClientRect(), level + 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick();
      closeAll();
    }
  };

  return (
    <div
      ref={itemRef}
      className={`${styles['context-menu-item']} ${item.disabled ? styles.disabled : ''} ${item.danger ? styles.danger : ''}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className={styles['context-menu-item-content']}>
        {item.icon && <span className={styles['context-menu-icon']}>{item.icon}</span>}
        <span className={styles['context-menu-label']}>{item.label}</span>
        {item.shortcut && <span className={styles['context-menu-shortcut']}>{item.shortcut}</span>}
        {hasSubmenu && <span className={styles['context-menu-arrow']}>▶</span>}
      </div>
    </div>
  );
};
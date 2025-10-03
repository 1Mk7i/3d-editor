'use client';

import React, { useEffect, useRef, useState } from 'react';
import Submenu from './Submenu';
import styles from './ContextMenu.module.css';

export interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  onClick?: () => void;
}

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  items,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [submenuStack, setSubmenuStack] = useState<Array<{
    id: string;
    items: ContextMenuItem[];
    position: { x: number; y: number };
    level: number;
  }>>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Перевіряємо, чи клік був на меню чи підменю
      const target = event.target as Element;
      const isMenuClick = menuRef.current && menuRef.current.contains(target);
      const isSubmenuClick = target.closest('.submenu') !== null;
      const isContextMenuItem = target.closest('.context-menu-item') !== null;
      
      // Якщо це клік на пункті меню, не закриваємо меню
      if (isContextMenuItem) {
        return;
      }
      
      if (!isMenuClick && !isSubmenuClick) {
        setSubmenuStack([]);
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSubmenuStack([]);
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isVisible, onClose]);

  // Окремий useEffect для очищення стеку підменю при відкритті/закритті меню
  useEffect(() => {
    setSubmenuStack([]);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust position if menu would go off screen
      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menu.style.left = `${Math.max(10, adjustedX)}px`;
      menu.style.top = `${Math.max(10, adjustedY)}px`;
    }
  }, [isVisible, position]);

  const handleItemClick = (item: ContextMenuItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (item.disabled || item.separator) return;
    
    if (item.submenu && item.submenu.length > 0) {
      // Для кліку просто показуємо/приховуємо підменю
      const existingSubmenu = submenuStack.find(s => s.id === item.id);
      if (existingSubmenu) {
        setSubmenuStack(prev => prev.filter(s => s.level <= existingSubmenu.level - 1));
      } else {
        const itemElement = event.currentTarget as HTMLElement;
        const rect = itemElement.getBoundingClientRect();
        showSubmenu(item, rect, 0);
      }
    } else {
      // Викликаємо onClick і закриваємо меню
      if (item.onClick) {
        item.onClick();
      }
      setSubmenuStack([]);
      onClose();
    }
  };

  const showSubmenu = (item: ContextMenuItem, rect: DOMRect, level: number) => {
    if (!item.submenu || item.submenu.length === 0) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const submenuWidth = 250;
    const submenuHeight = Math.min(item.submenu.length * 45, 400);
    
    let submenuX: number;
    let submenuY = rect.top;
    
    // Детальне діагностування координат батьківського елемента
    console.log('=== SUBMENU POSITIONING DEBUG ===');
    console.log('Parent element rect:', {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    });
    console.log('Viewport:', { width: viewportWidth, height: viewportHeight });
    console.log('Submenu dimensions:', { width: submenuWidth, height: submenuHeight });
    
    // Спочатку розраховуємо позицію справа (стандартно)
    const rightPosition = rect.right + 5;
    const leftPosition = rect.left - submenuWidth - 5; // додаємо невеликий gap
    
    console.log('Calculated positions:');
    console.log('  Right position:', rightPosition);
    console.log('  Left position:', leftPosition);
    console.log('  Right edge would be at:', rightPosition + submenuWidth);
    console.log('  Available space on right:', viewportWidth - rightPosition);
    console.log('  Available space on left:', rect.left);
    
    // Перевіряємо, чи поміщається справа
    const fitsOnRight = (rightPosition + submenuWidth) <= (viewportWidth - 10);
    const fitsOnLeft = leftPosition >= 10;
    
    console.log('Fits on right:', fitsOnRight);
    console.log('Fits on left:', fitsOnLeft);
    
    if (fitsOnRight) {
      submenuX = rightPosition;
      console.log('✓ Using RIGHT position:', submenuX);
    } else if (fitsOnLeft) {
      // Покращена логіка для лівого позиціонування
      submenuX = leftPosition;
      console.log('✓ Using LEFT position:', submenuX);
      
      // Додаткова корекція для кращого прилипання
      const visualGap = 2; // мінімальний зазор для візуального прилипання
      submenuX = rect.left - submenuWidth - visualGap;
      console.log('✓ Adjusted LEFT position with visual gap:', submenuX);
    } else {
      // Якщо не поміщається нікуди, показуємо справа з обрізанням
      submenuX = Math.max(10, viewportWidth - submenuWidth - 10);
      console.log('⚠ Using fallback position (right with clipping):', submenuX);
    }
    
    // Обмежуємо тільки по висоті
    if (submenuY + submenuHeight > viewportHeight - 10) {
      submenuY = viewportHeight - submenuHeight - 10;
    }
    if (submenuY < 10) {
      submenuY = 10;
    }
    
    console.log('=== FINAL POSITION ===');
    console.log('Final submenu position:', { x: submenuX, y: submenuY });
    console.log('==============================');
    
    // Видаляємо всі підменю з вищим або рівним рівнем
    setSubmenuStack(prev => {
      const filtered = prev.filter(s => s.level < level);
      return [
        ...filtered,
        {
          id: item.id,
          items: item.submenu!,
          position: { x: submenuX, y: submenuY },
          level: level
        }
      ];
    });
  };

  const handleItemHover = (item: ContextMenuItem, event: React.MouseEvent) => {
    // Очищуємо попередній таймаут
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (item.submenu && item.submenu.length > 0) {
      const itemElement = event.currentTarget as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      showSubmenu(item, rect, 0);
    } else {
      // Закриваємо всі підменю для звичайних елементів
      setSubmenuStack([]);
    }
  };

  const handleItemLeave = (item: ContextMenuItem) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Даємо час перейти на підменю, тільки для елементів з підменю
    if (item.submenu && item.submenu.length > 0) {
      hoverTimeoutRef.current = setTimeout(() => {
        setSubmenuStack([]);
      }, 200);
    }
  };

  const handleSubmenuItemHover = (item: ContextMenuItem, event: React.MouseEvent, currentLevel: number) => {
    // Очищуємо таймаут закриття
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Якщо у елемента є вкладене підменю, показуємо його
    if (item.submenu && item.submenu.length > 0) {
      const itemElement = event.currentTarget as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      showSubmenu(item, rect, currentLevel + 1);
    } else {
      // Закриваємо всі підменю вищого рівня
      setSubmenuStack(prev => prev.filter(s => s.level <= currentLevel));
    }
  };

  const handleSubmenuItemLeave = (item: ContextMenuItem, currentLevel: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Даємо час перейти на наступне підменю
    if (item.submenu && item.submenu.length > 0) {
      hoverTimeoutRef.current = setTimeout(() => {
        setSubmenuStack(prev => prev.filter(s => s.level <= currentLevel));
      }, 200);
    }
  };

  const handleSubmenuItemClick = (item: ContextMenuItem, event: React.MouseEvent, currentLevel: number) => {
    console.log('=== handleSubmenuItemClick CALLED ===');
    console.log('Item:', item);
    console.log('Item label:', item.label);
    console.log('Item onClick:', item.onClick);
    console.log('Event:', event);
    console.log('Current level:', currentLevel);
    
    event.stopPropagation();
    
    if (item.disabled || item.separator) {
      console.log('Item is disabled or separator, returning');
      return;
    }
    
    if (item.submenu && item.submenu.length > 0) {
      console.log('Item has submenu, showing it');
      const itemElement = event.currentTarget as HTMLElement;
      const rect = itemElement.getBoundingClientRect();
      showSubmenu(item, rect, currentLevel + 1);
    } else {
      console.log('Item has no submenu, calling onClick');
      // Викликаємо onClick і закриваємо меню
      if (item.onClick) {
        console.log('Calling onClick...');
        item.onClick();
        console.log('onClick called successfully');
      } else {
        console.log('No onClick function found');
      }
      setSubmenuStack([]);
      onClose();
    }
    console.log('=== handleSubmenuItemClick END ===');
  };

  const handleSubmenuClose = (level?: number) => {
    if (level !== undefined) {
      setSubmenuStack(prev => prev.filter(s => s.level < level));
    } else {
      setSubmenuStack([]);
    }
  };

  const renderMenuItem = (item: ContextMenuItem) => {
    if (item.separator) {
      return <div key={item.id} className={styles['context-menu-separator']} />;
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div
        key={item.id}
        className={`${styles['context-menu-item']} ${item.disabled ? styles.disabled : ''} ${item.danger ? styles.danger : ''}`}
        data-has-submenu={hasSubmenu ? 'true' : 'false'}
        onClick={(e) => handleItemClick(item, e)}
        onMouseEnter={(e) => handleItemHover(item, e)}
        onMouseLeave={() => handleItemLeave(item)}
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

  return (
    <>
      <div
        ref={menuRef}
        className={styles['context-menu']}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }}
      >
        <div className={styles['context-menu-content']}>
          {items.map(renderMenuItem)}
        </div>
      </div>
      
      {submenuStack.map((submenu) => (
        <Submenu
          key={`${submenu.id}-${submenu.level}`}
          isVisible={true}
          position={submenu.position}
          items={submenu.items}
          level={submenu.level}
          onClose={() => handleSubmenuClose(submenu.level)}
          onItemHover={(item, event) => handleSubmenuItemHover(item, event, submenu.level)}
          onItemLeave={(item) => handleSubmenuItemLeave(item, submenu.level)}
          onItemClick={(item, event) => handleSubmenuItemClick(item, event, submenu.level)}
        />
      ))}
    </>
  );
};

export default ContextMenu;

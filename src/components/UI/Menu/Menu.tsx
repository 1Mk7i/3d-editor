import React from 'react';
import styles from './Menu.module.css';
import { MenuProps } from './types';
import clsx from 'clsx';

const Menu: React.FC<MenuProps> = ({
  variant = 'primary',
  position = 'top',
  size = 'medium',
  style,
  title = "Menu",
  children,
  className,
  isCollapsible = false,
  isCollapsed = false,
  onCollapse,
  showTitle = true,
  titleAlignment = 'left',
  borderStyle = 'none',
  elevation = 1,
  orientation = 'none'
}) => {
  const menuClasses = clsx(
    styles.menu,
    styles[variant],
    styles[position],
    styles[size],
    isCollapsible && styles.collapsible,
    isCollapsed && styles.collapsed,
    borderStyle !== 'none' && styles[`border${borderStyle.charAt(0).toUpperCase()}${borderStyle.slice(1)}`],
    styles[`elevation${elevation}`],
    styles[orientation],
    className
  );

  const titleClasses = clsx(
    styles.title,
    styles[`title${titleAlignment.charAt(0).toUpperCase()}${titleAlignment.slice(1)}`]
  );

  const handleClick = () => {
    if (isCollapsible && onCollapse) {
      onCollapse();
    }
  };

  return (
    <div className={menuClasses} style={style} onClick={handleClick}>
      {showTitle && <h1 className={titleClasses}>{title}</h1>}
      {children}
    </div>
  );
};

export { Menu };
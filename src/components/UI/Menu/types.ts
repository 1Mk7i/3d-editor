import { CSSProperties, ReactNode } from 'react';

export type MenuVariant = 'primary' | 'secondary' | 'dark' | 'light' | 'transparent' | 'invisible';
export type MenuPosition = 'top' | 'left' | 'right' | 'bottom';
export type MenuSize = 'small' | 'medium' | 'large';

export interface MenuProps {
  variant?: MenuVariant;
  position?: MenuPosition;
  size?: MenuSize;
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
  className?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  showTitle?: boolean;
  titleAlignment?: 'left' | 'center' | 'right';
  borderStyle?: 'none' | 'solid' | 'dashed';
  elevation?: 0 | 1 | 2 | 3 | 4;
  orientation?: 'none' | 'horizontal' | 'vertical';
}
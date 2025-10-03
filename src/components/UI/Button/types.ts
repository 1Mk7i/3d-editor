import { CSSProperties, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'menu';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
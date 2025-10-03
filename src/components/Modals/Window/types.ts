import { ReactNode } from 'react';

export interface WindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  isVisible: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
  children: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  confirmClose?: boolean;
  closeConfirmMessage?: string;
}
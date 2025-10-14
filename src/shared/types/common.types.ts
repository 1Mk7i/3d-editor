/**
 * Загальні типи, що використовуються по всьому проекту
 */

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type TransformMode = 'translate' | 'rotate' | 'scale';

export type WindowType = 'settings' | 'chat' | 'ai-chat' | 'calculator' | 'file-manager';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

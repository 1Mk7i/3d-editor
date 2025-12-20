'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Window.css';
import { WindowProps } from './types';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  isVisible,
  isMinimized = false,
  isMaximized = false,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  maxSize,
  resizable = true,
  draggable = true,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  zIndex = 1000,
  confirmClose = false,
  closeConfirmMessage = "Ви впевнені, що хочете закрити це вікно?",
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState('');
  const [wasMaximized, setWasMaximized] = useState(false);
  const [savedSize, setSavedSize] = useState(initialSize);
  const [savedPosition, setSavedPosition] = useState(initialPosition);
  const [isClosing, setIsClosing] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMaximized && !wasMaximized) {
      // Зберігаємо поточний розмір та позицію перед максимізацією
      setSavedSize(size);
      setSavedPosition(position);
      setPosition({ x: 0, y: 0 });
      
      // Якщо є обмеження maxSize, використовуємо його, інакше розгортаємо на весь екран
      if (maxSize) {
        setSize(maxSize);
      } else {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
      setWasMaximized(true);
    } else if (!isMaximized && wasMaximized) {
      // Повертаємо збережені розміри після максимізації
      setSize(savedSize);
      setPosition(savedPosition);
      setWasMaximized(false);
    }
  }, [isMaximized, size, position, savedSize, savedPosition, maxSize]);

  // На мобільних пристроях автоматично максимізуємо вікно при відкритті
  useEffect(() => {
    if (isMobile && isVisible && !isMaximized && !wasMaximized) {
      setSavedSize(size);
      setSavedPosition(position);
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setWasMaximized(true);
      if (onMaximize) {
        onMaximize();
      }
    }
  }, [isMobile, isVisible, isMaximized, wasMaximized, size, position, onMaximize]);

  // Встановлюємо maxSize після монтування компонента
  const [maxSizeState, setMaxSizeState] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMaxSizeState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }
  }, []);

  const actualMaxSize = maxSize || maxSizeState;

  // Функція закриття з анімацією
  const handleClose = useCallback(() => {
    if (confirmClose) {
      if (window.confirm(closeConfirmMessage)) {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
        }, 300);
      }
    } else {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }, [confirmClose, closeConfirmMessage, onClose]);

  // Обробник клавіш (Escape для закриття)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible && !isMinimized) {
        e.preventDefault();
        handleClose();
      }
    };

    if (isVisible && !isMinimized) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isMinimized, handleClose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggable && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Обмежуємо переміщення в межах екрану
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }

      if (isResizing && resizable && !isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeDirection.includes('right')) {
          newWidth = Math.max(minSize.width, Math.min(actualMaxSize.width, resizeStart.width + deltaX));
        }
        if (resizeDirection.includes('left')) {
          newWidth = Math.max(minSize.width, Math.min(actualMaxSize.width, resizeStart.width - deltaX));
          newX = Math.min(resizeStart.x + deltaX, position.x + size.width - minSize.width);
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(minSize.height, Math.min(actualMaxSize.height, resizeStart.height + deltaY));
        }
        if (resizeDirection.includes('top')) {
          newHeight = Math.max(minSize.height, Math.min(actualMaxSize.height, resizeStart.height - deltaY));
          newY = Math.min(resizeStart.y + deltaY, position.y + size.height - minSize.height);
        }

        setSize({ width: newWidth, height: newHeight });
        if (resizeDirection.includes('left') || resizeDirection.includes('top')) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, resizeDirection, position, size, draggable, resizable, isMaximized, minSize, actualMaxSize]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isMaximized || isMobile) return;
    
    e.preventDefault();
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onFocus?.();
    }
  };

  const handleTitleBarDoubleClick = () => {
    // Ігноруємо подвійний клік, якщо була натиснута кнопка
    if (isButtonClicked) {
      setIsButtonClicked(false);
      return;
    }
    
    // Подвійний клік на заголовку - максимізувати/відновити
    if (onMaximize && onRestore) {
      if (isMaximized) {
        onRestore?.();
      } else {
        onMaximize?.();
      }
    }
  };

  // Скидаємо флаг кнопки через деякий час
  useEffect(() => {
    if (isButtonClicked) {
      const timeout = setTimeout(() => {
        setIsButtonClicked(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isButtonClicked]);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (!resizable || isMaximized || isMobile) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    setResizeDirection(direction);
    setIsResizing(true);
    onFocus?.();
  };

  const handleWindowClick = () => {
    onFocus?.();
  };

  if (!isVisible) return null;

  if (isMinimized) {
    return null; // Мінімізовані вікна не відображаються
  }

  return (
    <div
      ref={windowRef}
      className={`kde-window ${isMaximized ? 'maximized' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${isClosing ? 'closing' : ''}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className="kde-window-titlebar"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <div className="kde-window-title">
          {icon && <span className="kde-window-icon">{icon}</span>}
          <span className="kde-window-title-text">{title}</span>
        </div>
        
        <div className="kde-window-controls">
          {onMinimize && (
            <button
              className="kde-window-control minimize"
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsButtonClicked(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              title="Мінімізувати"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="3" y="5.5" width="6" height="1" fill="currentColor"/>
              </svg>
            </button>
          )}
          
          {(onMaximize || onRestore) && (
            <button
              className="kde-window-control maximize"
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsButtonClicked(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (isMaximized) {
                  onRestore?.();
                } else {
                  onMaximize?.();
                }
              }}
              title={isMaximized ? "Відновити" : "Максимізувати"}
            >
              {isMaximized ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <rect x="4" y="4" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
                </svg>
              )}
            </button>
          )}
          
          <button
            className="kde-window-control close"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsButtonClicked(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Закрити"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="kde-window-content">
        {children}
      </div>

      {/* Resize Handles */}
      {resizable && !isMaximized && !isMobile && (
        <>
          {/* Corners */}
          <div
            className="kde-window-resize-handle top-left"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
          />
          <div
            className="kde-window-resize-handle top-right"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
          />
          <div
            className="kde-window-resize-handle bottom-left"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
          />
          <div
            className="kde-window-resize-handle bottom-right"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
          />
          
          {/* Edges */}
          <div
            className="kde-window-resize-handle top"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
          />
          <div
            className="kde-window-resize-handle bottom"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
          />
          <div
            className="kde-window-resize-handle left"
            onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
          />
          <div
            className="kde-window-resize-handle right"
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
          />
        </>
      )}
    </div>
  );
};

export default Window;

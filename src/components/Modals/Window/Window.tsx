'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './Window.css';
import { WindowProps } from './types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SCENE_CONSTANTS } from '@/shared/constants/scene.constants';

export const Window: React.FC<WindowProps> = ({
  title,
  icon,
  isVisible,
  isMinimized = false,
  isMaximized = false,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 600 },
  children,
  onClose,
  onFocus,
  zIndex = SCENE_CONSTANTS.Z_INDEX.WINDOW_BASE,
}) => {
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startMetrics, setStartMetrics] = useState({ mouseX: 0, mouseY: 0, windowX: 0, windowY: 0, width: 0, height: 0 });
  const TOP_NAV_HEIGHT = 48;
  const MIN_SIZE = 600;

  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    onFocus?.();
    setIsDragging(true);
    setStartMetrics({
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: position.x,
      windowY: position.y,
      width: size.width,
      height: size.height,
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setStartMetrics({
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: position.x,
      windowY: position.y,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startMetrics.mouseX;
        const deltaY = e.clientY - startMetrics.mouseY;

        // Початкові розрахункові координати
        let newX = startMetrics.windowX + deltaX;
        let newY = startMetrics.windowY + deltaY;

        // 1. Обмеження по горизонталі (X)
        const maxX = window.innerWidth - startMetrics.width;
        newX = Math.max(0, Math.min(newX, maxX));

        // 2. ОБМЕЖЕННЯ ПО ВЕРТИКАЛІ (Y) з урахуванням TOP_NAV_HEIGHT
        const maxY = window.innerHeight - startMetrics.height;
        
        // Замість Math.max(0, ...) використовуємо TOP_NAV_HEIGHT
        // Тепер вікно зупиниться рівно під панеллю
        newY = Math.max(TOP_NAV_HEIGHT, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - startMetrics.mouseX;
        const deltaY = e.clientY - startMetrics.mouseY;
        
        // Обмежуємо розтягування, щоб не вилізти за межі екрана
        const maxWidth = window.innerWidth - position.x;
        const maxHeight = window.innerHeight - position.y;

        setSize({
          width: Math.max(MIN_SIZE, Math.min(startMetrics.width + deltaX, maxWidth)),
          height: Math.max(MIN_SIZE, Math.min(startMetrics.height + deltaY, maxHeight)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startMetrics, position.x, position.y, TOP_NAV_HEIGHT]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  if (!isVisible || isMinimized) return null;

  const dynamicStyles: React.CSSProperties = isMobile ? {
    position: 'fixed',
    top: `${TOP_NAV_HEIGHT}px`,
    left: 0,
    width: '100vw',
    height: `calc(100dvh - ${TOP_NAV_HEIGHT}px)`,
    zIndex,
  } : {
    position: 'fixed',
    left: isMaximized ? 0 : position.x,
    top: isMaximized ? 0 : position.y,
    width: isMaximized ? '100vw' : size.width,
    height: isMaximized ? '100vh' : size.height,
    zIndex,
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease-out',
  };

  return (
    <div
      className={`kde-window ${isMobile ? 'mobile' : ''} ${isMaximized ? 'maximized' : ''} ${isClosing ? 'closing' : ''}`}
      style={dynamicStyles}
      onMouseDown={() => onFocus?.()}
    >
      <div 
        className="kde-window-titlebar" 
        onMouseDown={handleDragStart}
        style={{ cursor: isMaximized ? 'default' : 'grab' }}
      >
        <div className="kde-window-title">
          {icon && <span className="kde-window-icon">{icon}</span>}
          <span className="kde-window-title-text">{title}</span>
        </div>
        <div className="kde-window-controls">
          <button className="kde-window-control close" onClick={handleClose}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      <div className="kde-window-content">
        {children}
      </div>

      {!isMaximized && !isMobile && (
        <div 
          className="kde-window-resize-handle"
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '15px',
            height: '15px',
            cursor: 'nwse-resize',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};
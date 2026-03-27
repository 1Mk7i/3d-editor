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
  initialSize = { width: 600, height: 600 },
  children,
  onClose,
  onFocus,
  zIndex = 1000,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);

  const TOP_NAV_HEIGHT = 48; 

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
    borderRadius: 0,
    border: 'none',
    zIndex,
  } : {
    position: 'fixed',
    left: isMaximized ? 0 : initialPosition.x,
    top: isMaximized ? 0 : initialPosition.y,
    width: isMaximized ? '100vw' : initialSize.width,
    height: isMaximized ? '100vh' : initialSize.height,
    zIndex,
  };

  return (
    <div
      ref={windowRef}
      className={`kde-window ${isMobile ? 'mobile' : ''} ${isMaximized ? 'maximized' : ''} ${isClosing ? 'closing' : ''}`}
      style={dynamicStyles}
      onClick={() => onFocus?.()}
    >
      <div className="kde-window-titlebar">
        <div className="kde-window-title">
          {icon && <span className="kde-window-icon">{icon}</span>}
          <span className="kde-window-title-text">{title}</span>
        </div>
        
        <div className="kde-window-controls">
          <button
            className="kde-window-control close"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Закрити"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M3 3L9 9M9 3L3 9" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="kde-window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
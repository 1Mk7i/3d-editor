'use client';

import React, { useState, useEffect } from 'react';
import { Button, Fade, ButtonProps } from '@mui/material';

interface SmartButtonProps extends ButtonProps {
  id: string;
  label: string;
  persist?: boolean;
}

export const SmartButton: React.FC<SmartButtonProps> = ({ 
  id, 
  label, 
  persist = true,
  onClick,
  sx,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (persist) {
      const isHidden = localStorage.getItem(`smart_btn_${id}`) === 'true';
      if (isHidden) setIsVisible(false);
    }
  }, [id, persist]);

  const handleInternalClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);

    if (persist) {
      localStorage.setItem(`smart_btn_${id}`, 'true');
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Fade in={isVisible} unmountOnExit timeout={400}>
      <Button {...props} onClick={handleInternalClick} sx={{ ...sx, textTransform: 'none' }}>
        {label}
      </Button>
    </Fade>
  );
};
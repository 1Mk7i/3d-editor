'use client';

import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { ThreeObjectType, THREE_OBJECT_TYPES } from '@/shared/constants/threeObjects';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ObjectSelectorMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelect: (objectType: ThreeObjectType) => void;
}

export const ObjectSelectorMenu: React.FC<ObjectSelectorMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSelect,
}) => {
  const isMobile = useIsMobile();
  const handleSelect = (objectType: ThreeObjectType) => {
    onSelect(objectType);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: isMobile 
            ? 'calc(100vh - 100px)' 
            : 400,
          width: isMobile ? 'calc(100vw - 40px)' : 250,
          maxWidth: isMobile ? 'calc(100vw - 40px)' : 250,
        },
      }}
    >
      {THREE_OBJECT_TYPES.map((objectType) => (
        <MenuItem
          key={objectType.id}
          onClick={() => handleSelect(objectType)}
        >
          <ListItemIcon>
            {objectType.icon ? (
              <img
                src={objectType.icon}
                alt={objectType.name}
                style={{ width: 24, height: 24 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24/CCCCCC/666666?text=?';
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: 'action.disabled',
                  borderRadius: 1,
                }}
              />
            )}
          </ListItemIcon>
          <ListItemText primary={objectType.name} />
        </MenuItem>
      ))}
    </Menu>
  );
};


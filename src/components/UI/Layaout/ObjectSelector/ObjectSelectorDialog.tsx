'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { ThreeObjectType, THREE_OBJECT_TYPES } from '@/shared/constants/threeObjects';

interface ObjectSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (objectType: ThreeObjectType) => void;
}

export const ObjectSelectorDialog: React.FC<ObjectSelectorDialogProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const handleSelect = (objectType: ThreeObjectType) => {
    onSelect(objectType);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Виберіть об'єкт для створення</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {THREE_OBJECT_TYPES.map((objectType) => (
            <Grid item xs={6} sm={4} md={3} key={objectType.id}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => handleSelect(objectType)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {objectType.icon && (
                    <img
                      src={objectType.icon}
                      alt={objectType.name}
                      style={{ width: 48, height: 48 }}
                      onError={(e) => {
                        // Якщо іконка не завантажилась, показуємо placeholder
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48/CCCCCC/666666?text=?';
                      }}
                    />
                  )}
                  <Typography variant="body2">{objectType.name}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
      </DialogActions>
    </Dialog>
  );
};


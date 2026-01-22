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
                elevation={1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleSelect(objectType)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  {objectType.icon ? (
                    <Box
                      component="img"
                      src={objectType.icon}
                      alt={objectType.name}
                      sx={{
                        width: 48,
                        height: 48,
                        objectFit: 'contain',
                        // Адаптація під темну тему:
                        // Якщо тема темна, робимо іконку білою
                        filter: (theme) => {
                          const baseFilter = theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : '';
                          // Додаємо невелику тінь того ж кольору, що й лінія, щоб вона здавалася товстішою
                          return `${baseFilter} drop-shadow(0.5px 0px 0px white) drop-shadow(-0.5px 0px 0px white)`;
                        },
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/48/CCCCCC/666666?text=?';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'action.disabled',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Н/Д
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {objectType.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Скасувати
        </Button>
      </DialogActions>
    </Dialog>
  );
};
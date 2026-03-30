'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const MouseTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Керування мишею в 3D сцені
    </Typography>
    
    <Typography variant="body1" paragraph>
      Основний спосіб взаємодії з 3D сценою - це використання миші. Ось основні дії:
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Навігація по сцені:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Ліва кнопка миші + перетягування"
          secondary="Обертання камери навколо сцени"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Ліва кнопка миші + Shift + перетягування"
          secondary="Переміщення камери (pan)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Колесо миші"
          secondary="Масштабування (приближення/віддалення)"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Вибір та редагування об'єктів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Клік на об'єкт"
          secondary="Вибрати об'єкт для редагування"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Клік на порожнє місце"
          secondary="Скасувати вибір об'єкта"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Правий клік"
          secondary="Відкрити контекстне меню з додатковими опціями"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Порада:</strong> Використовуйте комбінацію різних дій мишею для 
        зручної навігації по сцені. Експериментуйте з різними кутами огляду!
      </Typography>
    </Box>
  </Box>
);

'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const GeneralInfoTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Ласкаво просимо до 3D Editor!
    </Typography>
    <Typography variant="body1" paragraph>
      3D Editor - це потужний інструмент для створення та редагування тривимірних сцен. 
      Цей додаток дозволяє вам створювати, маніпулювати та експортувати 3D об'єкти з 
      використанням технологій Three.js.
    </Typography>
    
    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Основні можливості:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Створення об'єктів"
          secondary="Додавайте різноманітні 3D об'єкти до вашої сцени: куби, сфери, циліндри та багато іншого"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Редагування об'єктів"
          secondary="Змінюйте позицію, обертання, масштаб та властивості об'єктів"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Робота з файлами"
          secondary="Імпортуйте та експортуйте ваші проекти в різних форматах"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Автозбереження"
          secondary="Ваша робота автоматично зберігається для захисту від втрати даних"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="AI Асистент"
          secondary="Використовуйте штучний інтелект для отримання допомоги та порад"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Підказка:</strong> Почніть зі створення простого об'єкта, щоб ознайомитися 
        з інтерфейсом. Використовуйте ліву панель для додавання об'єктів, а праву - для 
        перегляду та редагування їх властивостей.
      </Typography>
    </Box>
  </Box>
);

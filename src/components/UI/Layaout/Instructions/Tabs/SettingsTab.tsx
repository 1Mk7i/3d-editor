'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const SettingsTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Налаштування додатку
    </Typography>
    
    <Typography variant="body1" paragraph>
      У налаштуваннях ви можете персоналізувати додаток під свої потреби. 
      Всі зміни застосовуються після натиску кнопки "Зберегти".
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Налаштування інтерфейсу:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Тема"
          secondary="Виберіть світлу, темну або автоматичну тему (залежить від системних налаштувань)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Розмір шрифту"
          secondary="Налаштуйте розмір шрифту для зручності читання (10-20px)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Мова інтерфейсу"
          secondary="Виберіть мову інтерфейсу (українська або англійська)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Анімації"
          secondary="Увімкніть або вимкніть анімації для покращення продуктивності"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Налаштування автозбереження:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Увімкнути автозбереження"
          secondary="Автоматично зберігати поточну сесію через заданий інтервал"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Інтервал автозбереження"
          secondary="Встановіть інтервал від 10 секунд до 5 хвилин. Автозбереження допомагає відновити роботу при несподіваному закритті"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Налаштування 3D сцени:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Колір фону"
          secondary="Виберіть колір фону 3D сцени"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Сітка"
          secondary="Показувати або приховати сітку, налаштувати її розмір та кількість поділок"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Якість рендерингу"
          secondary="Виберіть якість рендерингу: низька, середня або висока (впливає на продуктивність)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Тіні"
          secondary="Увімкнути або вимкнути відображення тіней для більш реалістичного вигляду"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Згладжування"
          secondary="Увімкнути антиаліасинг для більш плавних країв об'єктів"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Підказка:</strong> Всі налаштування зберігаються локально в вашому браузері. 
        Ви можете скинути налаштування до значень за замовчуванням або очистити всі дані 
        через відповідні кнопки в налаштуваннях.
      </Typography>
    </Box>
  </Box>
);

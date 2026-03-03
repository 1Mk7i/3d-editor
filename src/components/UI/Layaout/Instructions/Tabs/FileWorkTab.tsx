'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const FileWorkTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Робота з файлами
    </Typography>
    
    <Typography variant="body1" paragraph>
      3D Editor підтримує роботу з файлами в різних форматах. Ви можете зберігати 
      свої проекти, імпортувати та експортувати моделі.
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Збереження проектів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Швидке збереження"
          secondary="Натисніть 'Файл' → 'Зберегти' для збереження поточного проекту в локальне сховище"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Автозбереження"
          secondary="Додаток автоматично зберігає вашу роботу через заданий інтервал (налаштовується в налаштуваннях)"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Майстерня проектів"
          secondary="Відкрийте 'Файл' → 'Майстерня' для перегляду всіх збережених проектів, їх перейменування та видалення"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Експорт проектів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="JSON"
          secondary="Зберігає всі дані сцени: об'єкти, позиції, кольори, матеріали"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="GLTF/GLB"
          secondary="Стандартний формат для 3D моделей, підтримується більшістю програм"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="OBJ, STL, PLY"
          secondary="Популярні формати для 3D друку та обміну моделями"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Імпорт моделей:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Автоматичне визначення формату"
          secondary="Просто виберіть файл - формат визначиться автоматично за розширенням"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Підтримувані формати"
          secondary="JSON, GLTF, GLB, OBJ, STL, PLY, FBX, DAE та інші"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <img 
        src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Робота+з+файлами" 
        alt="Робота з файлами"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
      />
    </Box>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Важливо:</strong> Регулярно зберігайте свою роботу! Хоча автозбереження 
        працює автоматично, краще робити ручні збереження перед важливими змінами.
      </Typography>
    </Box>
  </Box>
);

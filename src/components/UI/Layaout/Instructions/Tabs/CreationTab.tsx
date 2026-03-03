'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const CreationTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Створення об'єктів
    </Typography>
    
    <Typography variant="body1" paragraph>
      У 3D Editor ви можете створювати різноманітні тривимірні об'єкти. 
      Всі об'єкти створюються в нульових координатах (0, 0, 0) з базовим кольором.
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Способи створення об'єктів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Через меню 'Об'єкт'"
          secondary="Натисніть кнопку 'Об'єкт' в верхній панелі та виберіть потрібний об'єкт з випадаючого списку"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Через ліву панель"
          secondary="Натисніть кнопку '+' в лівій панелі, щоб відкрити модальне вікно з усіма доступними об'єктами"
        />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Доступні типи об'єктів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Куб (Box)"
          secondary="Стандартний куб з рівними сторонами"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Сфера (Sphere)"
          secondary="Ідеальна сфера з плавною поверхнею"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Циліндр (Cylinder)"
          secondary="Циліндричний об'єкт з круглою основою"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Конус (Cone)"
          secondary="Конічний об'єкт з круглою основою"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Тор (Torus)"
          secondary="Об'єкт у формі бублика"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Вузол тора (Torus Knot)"
          secondary="Складний об'єкт з переплетеними формами"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Октаедр, Тетраедр, Ікосаедр, Додекаедр"
          secondary="Платонові тіла - правильні багатогранники"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Площина, Кільце, Труба, Обертання, Капсула"
          secondary="Інші спеціалізовані геометричні форми"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <img 
        src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Створення+об'єктів" 
        alt="Створення об'єктів"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
      />
    </Box>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Порада:</strong> Після створення об'єкт автоматично з'являється в центрі сцени. 
        Ви можете одразу почати його редагувати, вибравши об'єкт та увімкнувши режим редагування.
      </Typography>
    </Box>
  </Box>
);

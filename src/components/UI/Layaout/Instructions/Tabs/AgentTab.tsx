'use client';

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export const AgentTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>
      AI Агент - Управління сценою текстовими командами
    </Typography>
    
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <img 
        src="/assets/instructions/AgentTab/ChatLayaout.png" 
        alt="AI Агент"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
      />
    </Box>
    
    <Typography variant="body1" paragraph>
      Режим агента дозволяє керувати 3D сценою через текстові команди. 
      Агент розуміє ваші інструкції та автоматично виконує дії на сцені.
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Перемикання режимів:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Режим 'Чат'"
          secondary="Звичайна розмова з AI для отримання порад та відповідей на питання"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Режим 'Агент'"
          secondary="Команди для управління 3D сценою. AI виконує дії на основі ваших інструкцій"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Порада:</strong> У режимі агента ви можете використовувати природну мову. 
        Агент розуміє контекст та автоматично визначає, яку дію потрібно виконати. 
        Для посилання на вибраний об'єкт використовуйте фрази типу "вибраний об'єкт" або "поточний об'єкт".
      </Typography>
    </Box>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Доступні команди в режимі агента:
    </Typography>
    <List>
      <ListItem>
        <ListItemText 
          primary="Створення об'єктів"
          secondary="Приклади: 'Створи червоний куб', 'Додай сферу на позиції 2, 0, 0', 'Створи синій циліндр'"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Зміна позиції"
          secondary="Приклади: 'Перемісти об'єкт на 1, 2, 3', 'Помісти куб в центр'"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Обертання"
          secondary="Приклади: 'Оберни на 90 градусів по X', 'Поверни вибраний об'єкт'"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Зміна кольору"
          secondary="Приклади: 'Зроби червоним', 'Зміни колір на синій', 'Зафарбуй в зелений'"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Видалення"
          secondary="Приклади: 'Видали куб', 'Видали вибраний об'єкт'"
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Вибір об'єктів"
          secondary="Приклади: 'Вибери куб', 'Виберіть сферу'"
        />
      </ListItem>
    </List>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Важливо:</strong> Агент повертає команди у форматі JSON. Якщо команда 
        не розпізнана або містить помилки, вона не буде виконана. Перевірте правильність 
        формулювання команди та спробуйте ще раз.
      </Typography>
    </Box>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      Доступні типи об'єктів:
    </Typography>
    <Typography variant="body2" paragraph>
      Куб (box), Сфера (sphere), Циліндр (cylinder), Конус (cone), Тор (torus), 
      Вузол тора (torusKnot), Октаедр (octahedron), Тетраедр (tetrahedron), 
      Ікосаедр (icosahedron), Додекаедр (dodecahedron), Площина (plane), 
      Кільце (ring), Труба (tube), Обертання (lathe), Капсула (capsule)
    </Typography>

    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
      API ключ:
    </Typography>
    <Typography variant="body1" paragraph>
      Для використання режиму агента необхідно ввести API ключ від Google AI Studio. 
      Ви можете отримати його на сайті Google AI Studio після реєстрації та створення нового проекту. 
      Введіть ключ у відповідне поле налаштувань, щоб активувати режим агента.
    </Typography>

    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) }}>
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        <strong>Порада:</strong> Перевірте чи ви справді скопіювали API ключ а не ID проекту.
        На цьому етапі користувачі дуже часто роблять помилку.
      </Typography>
    </Box>
  </Box>
);

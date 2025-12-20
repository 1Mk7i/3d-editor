'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Help as HelpIcon,
  Mouse as MouseIcon,
  Keyboard as KeyboardIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

export interface InstructionsProps {
  onClose?: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 200,
          borderRadius: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              px: 2,
            },
          }}
        >
          <Tab
            icon={<HelpIcon />}
            iconPosition="start"
            label="Загальна інформація"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<MouseIcon />}
            iconPosition="start"
            label="Керування мишею"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<KeyboardIcon />}
            iconPosition="start"
            label="Гарячі клавіші"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<CategoryIcon />}
            iconPosition="start"
            label="Створення об'єктів"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<FolderIcon />}
            iconPosition="start"
            label="Робота з файлами"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="Налаштування"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Paper>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h5">
            {activeTab === 0 && 'Загальна інформація'}
            {activeTab === 1 && 'Керування мишею'}
            {activeTab === 2 && 'Гарячі клавіші'}
            {activeTab === 3 && 'Створення об\'єктів'}
            {activeTab === 4 && 'Робота з файлами'}
            {activeTab === 5 && 'Налаштування'}
          </Typography>
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {activeTab === 0 && (
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

              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Підказка:</strong> Почніть зі створення простого об'єкта, щоб ознайомитися 
                  з інтерфейсом. Використовуйте ліву панель для додавання об'єктів, а праву - для 
                  перегляду та редагування їх властивостей.
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <img 
                  src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Головний+інтерфейс+додатку" 
                  alt="Головний інтерфейс"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
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
                    primary="Права кнопка миші + перетягування"
                    secondary="Переміщення камери (pan)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Колесо миші"
                    secondary="Масштабування (приближення/віддалення)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Подвійний клік на об'єкт"
                    secondary="Вибрати об'єкт та зосередити на ньому камеру"
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

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <img 
                  src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Керування+мишею" 
                  alt="Керування мишею"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Порада:</strong> Використовуйте комбінацію різних дій мишею для 
                  зручної навігації по сцені. Експериментуйте з різними кутами огляду!
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Гарячі клавіші
              </Typography>
              
              <Typography variant="body1" paragraph>
                Використання гарячих клавіш значно прискорює роботу з додатком. 
                Ось список доступних комбінацій:
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Загальні команди:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Ctrl + S"
                    secondary="Швидке збереження поточного проекту"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Ctrl + O"
                    secondary="Відкрити майстерню проектів"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Ctrl + N"
                    secondary="Створити новий проект (очистити сцену)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Delete або Backspace"
                    secondary="Видалити вибраний об'єкт"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Редагування об'єктів:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="E"
                    secondary="Увімкнути/вимкнути режим редагування"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="G"
                    secondary="Режим переміщення (Translate)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="R"
                    secondary="Режим обертання (Rotate)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="S"
                    secondary="Режим масштабування (Scale)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Esc"
                    secondary="Скасувати вибір об'єкта або вийти з режиму редагування"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Навігація:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="F"
                    secondary="Зосередити камеру на вибраному об'єкті"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Home"
                    secondary="Скинути вид камери до початкового положення"
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <img 
                  src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Гарячі+клавіші" 
                  alt="Гарячі клавіші"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
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

              <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Порада:</strong> Після створення об'єкт автоматично з'являється в центрі сцени. 
                  Ви можете одразу почати його редагувати, вибравши об'єкт та увімкнувши режим редагування.
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === 4 && (
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

              <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Важливо:</strong> Регулярно зберігайте свою роботу! Хоча автозбереження 
                  працює автоматично, краще робити ручні збереження перед важливими змінами.
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === 5 && (
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

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <img 
                  src="https://via.placeholder.com/600x300/CCCCCC/666666?text=Налаштування" 
                  alt="Налаштування"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                />
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Підказка:</strong> Всі налаштування зберігаються локально в вашому браузері. 
                  Ви можете скинути налаштування до значень за замовчуванням або очистити всі дані 
                  через відповідні кнопки в налаштуваннях.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};


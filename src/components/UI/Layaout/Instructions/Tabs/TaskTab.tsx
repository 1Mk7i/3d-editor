'use client';

import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { SmartButton } from '../SmartButton';
import { ZoomableImage } from '../ZoomableImage';
import { useTimerContext } from '@/context/TimerContext';

export const TaskTab: React.FC = () => {
  const context = useTimerContext();
  
  console.log("TIMER CONTEXT IN TASKTAB:", context);

  const { setIsActive, setLogs, seconds, formatTime, isActive } = context;

  const handleSaveLog = (comment: string) => {
    if (!isActive) setIsActive(true);
    
    const newLog = {
        id: crypto.randomUUID(),
        systemTime: new Date().toLocaleTimeString('uk-UA'),
        timerValue: formatTime(seconds),
        comment: comment
    };

    setLogs((prev: any[]) => [newLog, ...prev]);
  };

  const handleStopTimer = (comment: string) => {
    setIsActive(false);
    const newLog = {
        id: crypto.randomUUID(),
        systemTime: new Date().toLocaleTimeString('uk-UA'),
        timerValue: formatTime(seconds),
        comment: comment
    };

    setLogs((prev: any[]) => [newLog, ...prev]);
  };

  const handleResetButtons = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('smart_btn_')) localStorage.removeItem(key);
    });
    window.location.reload();
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>Навчальні квести</Typography>

      <Typography variant="body1" gutterBottom>
        Початок роботи:
      </Typography>

      <Typography variant="body1" gutterBottom>
        Для додавання об'єктів є 2 способи: через кнопку "+" або "Об'єкт":
      </Typography>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/add_objects.png" 
          alt="Будинок"
        />
      </Box>

      <Typography variant="body1" gutterBottom>
        Для редагування об'єктів кнопка з іконкою олівця або параметрів правої панелі:
      </Typography>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/edit_objects.png" 
          alt="Будинок"
        />
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <SmartButton 
            id="start_quest" 
            label="Старт" 
            variant="contained" 
            onClick={() => handleSaveLog("Квест: Початок роботи")}
          />
      </Box>

      <Typography variant="body1" gutterBottom>
        Завдання 1: Створити в ручну будинок

        Приклад:
      </Typography>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/house.png" 
          alt="Будинок"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <SmartButton 
            id="house_quest" 
            label="Завершити завдання 1" 
            variant="contained" 
            onClick={() => handleSaveLog("Квест: Завдання 1 виконано")}
          />
      </Box>

      <Typography variant="body1" gutterBottom component="div">
          Завдання 2: Авторизуватися в <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" sx={{ ml: 0.5 }}>
            Google AI Studio
          </Link> та створити проект. Скопіюйте API ключ та вставте його в чат.
      </Typography>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom>
          Приклад створення проекту:
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task2_1.png" 
          alt="Створення проекту в Google AI Studio"
        />
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task2_2.png" 
          alt="Введення назви проекту та вибір налаштувань"
        />
        <Typography variant="subtitle1" gutterBottom>
          Копіювання API ключа:
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task2_3.png" 
          alt="Копіювання API ключа в Google AI Studio" 
        />
        <Typography variant="subtitle1" gutterBottom>
          Вставка ключа в чат:
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task2_4.png" 
          alt="Вставка API ключа в чат"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <SmartButton 
            id="task2_quest" 
            label="Завершити завдання 2" 
            variant="contained" 
            onClick={() => handleSaveLog("Квест: Завдання 2 виконано")}
          />
      </Box>

      <Typography variant="body1" gutterBottom>
        Завдання 3: Додати назви об'єктів та змінити колір будинку використовуючи чат.
      </Typography>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom>
          Приклад зміни назви:
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task3_1.png" 
          alt="Зміна назви об'єкта"
        />
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task3_2.png" 
          alt="Змінені назви об'єктів в сцені"
        />
        <Typography variant="subtitle1" gutterBottom>
          Тепер потрібно змінити колір будинку через чат. ОБОВ'ЯЗКОВО потрібно обрати режим агента та вводимо назву об'єкта та колір, який хочемо отримати. Наприклад: "Зміни колір будинку на червоний".
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task3_3.png" 
          alt="Зміна кольору будинку в чаті"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <SmartButton 
            id="task3_quest" 
            label="Завершити завдання 3" 
            variant="contained" 
            onClick={() => handleSaveLog("Квест: Завдання 3 виконано")}
          />
      </Box>

      <Typography variant="body1" gutterBottom>
        Завдання 4: Створити біля будинку дерево з використанням чату.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <SmartButton 
            id="task4_quest" 
            label="Завершити завдання 4. Кінець квесту" 
            variant="contained" 
            onClick={() => handleStopTimer("Квест: Завдання 4 виконано. Квест завершено!")}
          />
      </Box>

      <Typography variant="body1" gutterBottom>
        Завдання 5: Завантажити звіт.
      </Typography>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom>
          Відкрити панель таймера:
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task5_1.png" 
          alt="Кнопка відкриття панелі таймера"
        />
        <Typography variant="subtitle1" gutterBottom>
          Натиснути кнопку "Експорт звіту"
        </Typography>
        <ZoomableImage 
          src="/assets/instructions/TaskTab/task5_2.png" 
          alt="Кнопка експорту звіту"
        />
        <Typography variant="subtitle1" gutterBottom>
          Зберегти файл у зручному місці на комп'ютері. (цей пк/all/!-TEST/)
        </Typography>
      </Box>

      <Button onClick={handleResetButtons} color="error" size="small" sx={{ mt: 5, opacity: 0.6 }}>
        Скинути прогрес інструкцій
      </Button>
    </Box>
  );
};
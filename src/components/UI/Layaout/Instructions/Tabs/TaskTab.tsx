'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Link, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions 
} from '@mui/material';
import { SmartButton } from '../SmartButton';
import { ZoomableImage } from '../ZoomableImage';
import { useTimerContext } from '@/context/TimerContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const TaskTab: React.FC = () => {
  const context = useTimerContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const { setIsActive, setLogs, seconds, formatTime, isActive } = context;
  const stepIds = ['start_quest', 'house_quest', 'task2_quest', 'task3_quest', 'task4_quest'];

  const updateMaxStep = () => {
    let reached = 0;
    stepIds.forEach((id, index) => {
      if (localStorage.getItem(`smart_btn_${id}`) === 'true') {
        reached = index + 1;
      }
    });
    setMaxStep(reached);
  };

  useEffect(() => {
    updateMaxStep();
  }, []);

  const handleNextStep = (comment: string, isFinal = false) => {
    if (isFinal) {
      setIsActive(false);
    } else if (!isActive) {
      setIsActive(true);
    }
    
    const newLog = {
      id: crypto.randomUUID(),
      systemTime: new Date().toLocaleTimeString('uk-UA'),
      timerValue: formatTime(seconds),
      comment: comment
    };

    setLogs((prev: any[]) => [newLog, ...prev]);
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > maxStep) setMaxStep(next);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleGoForward = () => {
    if (currentStep < maxStep) setCurrentStep((prev) => prev + 1);
  };

  const handleConfirmReset = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('smart_btn_')) localStorage.removeItem(key);
    });
    setCurrentStep(0);
    setMaxStep(0);
    setOpenResetDialog(false);
    window.location.reload();
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {currentStep > 0 && (
            <Button onClick={handlePrevStep} startIcon={<ArrowBackIosNewIcon />} size="small">
              Назад
            </Button>
          )}
          {currentStep < maxStep && (
            <Button 
                onClick={handleGoForward} 
                endIcon={<ArrowForwardIosIcon />} 
                size="small" 
                color="secondary"
            >
              Уперед
            </Button>
          )}
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'right' }}>
          {currentStep < 5 ? `Крок ${currentStep + 1} з 6` : 'Фініш'}
        </Typography>
      </Box>

      {currentStep === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Початок роботи</Typography>
          <Typography variant="body1" gutterBottom>
            Для додавання об'єктів є 2 способи: через кнопку "+" або "Об'єкт":
          </Typography>
          <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
            <ZoomableImage src="/assets/instructions/TaskTab/add_objects.png" alt="Додавання об'єктів" />
          </Box>
          <Typography variant="body1" gutterBottom>
            Для редагування об'єктів кнопка з іконкою олівця або параметрів правої панелі:
          </Typography>
          <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
            <ZoomableImage src="/assets/instructions/TaskTab/edit_objects.png" alt="Редагування об'єктів" />
          </Box>
          <SmartButton 
            id="start_quest" 
            label="Старт" 
            variant="contained" 
            fullWidth
            onClick={() => handleNextStep("Квест: Початок роботи")}
          />
        </Box>
      )}

      {currentStep === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">Завдання 1: Створити вручну будинок</Typography>
          <Typography variant="body1" gutterBottom>Приклад:</Typography>
          <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
            <ZoomableImage src="/assets/instructions/TaskTab/house.png" alt="Будинок" />
          </Box>
          <SmartButton 
            id="house_quest" 
            label="Завершити завдання 1" 
            variant="contained" 
            fullWidth
            onClick={() => handleNextStep("Квест: Завдання 1 виконано")}
          />
        </Box>
      )}

      {currentStep === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">Завдання 2: Налаштування API</Typography>
          <Typography variant="body1" gutterBottom component="div">
            Авторизуватися в <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" sx={{ fontWeight: 'bold' }}>
              Google AI Studio
            </Link> та створити проект. Скопіюйте API ключ та вставте його в чат.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>Приклад створення проекту:</Typography>
            <ZoomableImage src="/assets/instructions/TaskTab/task2_1.png" alt="Створення проекту" />
            <ZoomableImage src="/assets/instructions/TaskTab/task2_2.png" alt="Вибір налаштувань" />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Копіювання API ключа:</Typography>
            <ZoomableImage src="/assets/instructions/TaskTab/task2_3.png" alt="Копіювання ключа" />
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Вставка ключа в чат:</Typography>
            <ZoomableImage src="/assets/instructions/TaskTab/task2_4.png" alt="Вставка в чат" />
          </Box>
          <SmartButton 
            id="task2_quest" 
            label="Завершити завдання 2" 
            variant="contained" 
            fullWidth
            onClick={() => handleNextStep("Квест: Завдання 2 виконано")}
          />
        </Box>
      )}

      {currentStep === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">Завдання 3: Робота з чатом</Typography>
          <Typography variant="body1" gutterBottom>
            Додати назви об'єктів та змінити колір будинку використовуючи чат.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>Приклад зміни назви:</Typography>
            <ZoomableImage src="/assets/instructions/TaskTab/task3_1.png" alt="Зміна назви" />
            <ZoomableImage src="/assets/instructions/TaskTab/task3_2.png" alt="Назви в сцені" />
            <Typography variant="body2" sx={{ mt: 3, mb: 2, bgcolor: '#0c1344', p: 2, borderRadius: 1 }}>
              Тепер потрібно змінити колір будинку через чат. <strong>ОБОВ'ЯЗКОВО</strong> потрібно обрати режим агента та вводимо назву об'єкта та колір. Наприклад: "Зміни колір будинку на червоний".
            </Typography>
            <ZoomableImage src="/assets/instructions/TaskTab/task3_3.png" alt="Зміна кольору в чаті" />
          </Box>
          <SmartButton 
            id="task3_quest" 
            label="Завершити завдання 3" 
            variant="contained" 
            fullWidth
            onClick={() => handleNextStep("Квест: Завдання 3 виконано")}
          />
        </Box>
      )}

      {currentStep === 4 && (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">Завдання 4: Створення об'єктів</Typography>
          <Typography variant="body1" gutterBottom>
            Створити біля будинку дерево з використанням чату.
          </Typography>
          <Box sx={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Typography variant="body2" color="text.secondary">Використовуйте знання з попередніх кроків</Typography>
          </Box>
          <SmartButton 
            id="task4_quest" 
            label="Завершити завдання 4. Кінець квесту" 
            variant="contained" 
            fullWidth
            onClick={() => handleNextStep("Квест: Завдання 4 виконано. Квест завершено!", true)}
          />
        </Box>
      )}

      {currentStep === 5 && (
        <Box>
          <Typography variant="h5" gutterBottom color="success.main" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Вітаю! Всі завдання виконано.
          </Typography>
          <Typography variant="h6" gutterBottom>Завдання 5: Завантажити звіт</Typography>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <ZoomableImage src="/assets/instructions/TaskTab/task5_1.png" alt="Панель таймера" />
            <ZoomableImage src="/assets/instructions/TaskTab/task5_2.png" alt="Кнопка експорту" />
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Збережіть файл звіту.
            </Typography>
          </Box>

          <Box sx={{ mt: 6, p: 2, border: '1px dashed red', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
              УВАГА! Натискати тільки після завантаження звіту!
            </Typography>
            <Button 
              onClick={() => setOpenResetDialog(true)} 
              variant="contained" 
              color="error" 
              fullWidth
            >
              Скинути прогрес інструкцій
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Підтвердження скидання</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені? Це видалить всі записи про виконання завдань.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Скасувати</Button>
          <Button onClick={handleConfirmReset} color="error" variant="contained">Так, видалити все</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
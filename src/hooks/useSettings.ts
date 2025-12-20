'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface SettingsData {
  // UI
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: number;
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // інтервал в секундах
  
  // 3D сцена
  sceneBackgroundColor: string;
  gridVisible: boolean;
  gridSize: number;
  gridDivisions: number;
  renderQuality: 'low' | 'medium' | 'high';
  shadows: boolean;
  antialiasing: boolean;
}

const DEFAULT_SETTINGS: SettingsData = {
  theme: 'dark',
  language: 'uk',
  fontSize: 14,
  animations: true,
  notifications: true,
  autoSave: true,
  autoSaveInterval: 30, // 30 секунд
  sceneBackgroundColor: '#121212',
  gridVisible: true,
  gridSize: 20,
  gridDivisions: 20,
  renderQuality: 'high',
  shadows: true,
  antialiasing: true,
};

const STORAGE_KEY = 'app-settings';

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Завантажуємо налаштування з localStorage після монтування
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      return;
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Мержимо з дефолтними налаштуваннями для нових полів
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Помилка при завантаженні налаштувань:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Застосовуємо налаштування при зміні (тільки після завантаження)
  // Це викликається тільки коли налаштування змінюються через saveSettings
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    
    // Застосовуємо розмір шрифту
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    // Застосовуємо тему
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else if (settings.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      // auto - використовуємо системну тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    }
  }, [settings.theme, settings.fontSize, isLoaded]);

  const updateSetting = useCallback(<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SettingsData>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveSettings = useCallback((newSettings: SettingsData) => {
    // Створюємо новий об'єкт, щоб гарантувати оновлення
    const updatedSettings = { ...newSettings };
    setSettings(updatedSettings);
    // Зберігаємо в localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Помилка при збереженні налаштувань:', error);
      }
    }
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      } catch (error) {
        console.error('Помилка при скиданні налаштувань:', error);
      }
    }
  }, []);

  const clearAllData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Повертаємо об'єкт напряму без useMemo для гарантії оновлення
  // Це гарантує, що компоненти бачать зміни одразу
  return {
    settings,
    updateSetting,
    updateSettings,
    saveSettings,
    resetSettings,
    clearAllData,
  };
}


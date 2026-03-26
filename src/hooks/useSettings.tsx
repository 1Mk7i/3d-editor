'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: number;
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
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
  autoSaveInterval: 30,
  sceneBackgroundColor: '#121212',
  gridVisible: true,
  gridSize: 20,
  gridDivisions: 20,
  renderQuality: 'high',
  shadows: true,
  antialiasing: true,
};

const STORAGE_KEY = 'app-settings';

interface SettingsContextType {
  settings: SettingsData;
  saveSettings: (newSettings: SettingsData) => void;
  resetSettings: () => void;
  clearAllData: () => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('app-settings');
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch (e) {
        console.error("Error parsing settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: SettingsData) => {
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('app-settings', JSON.stringify(DEFAULT_SETTINGS));
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.clear();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, resetSettings, clearAllData, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
'use client';

import React, { useState } from 'react';
import './Settings.css';

export interface SettingsProps {
  onClose?: () => void;
}

interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: number;
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'light',
    language: 'uk',
    fontSize: 14,
    animations: true,
    notifications: true,
    autoSave: true,
  });

  const [activeTab, setActiveTab] = useState('appearance');

  const handleSettingChange = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Тут можна зберегти налаштування в localStorage або відправити на сервер
    localStorage.setItem('app-settings', JSON.stringify(settings));
    console.log('Налаштування збережено:', settings);
    onClose?.();
  };

  const handleReset = () => {
    setSettings({
      theme: 'light',
      language: 'uk',
      fontSize: 14,
      animations: true,
      notifications: true,
      autoSave: true,
    });
  };

  const tabs = [
    { id: 'appearance', label: 'Вигляд', icon: '🎨' },
    { id: 'behavior', label: 'Поведінка', icon: '⚙️' },
    { id: 'privacy', label: 'Приватність', icon: '🔒' },
  ];

  const renderAppearanceTab = () => (
    <div className="settings-tab-content">
      <div className="settings-group">
        <h3>Тема</h3>
        <div className="settings-option">
          <label>Оберіть тему:</label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
          >
            <option value="light">Світла</option>
            <option value="dark">Темна</option>
            <option value="auto">Автоматично</option>
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h3>Шрифт</h3>
        <div className="settings-option">
          <label>Розмір шрифту:</label>
          <div className="range-input">
            <input
              type="range"
              min="10"
              max="20"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
            />
            <span>{settings.fontSize}px</span>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Мова</h3>
        <div className="settings-option">
          <label>Мова інтерфейсу:</label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
          >
            <option value="uk">Українська</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBehaviorTab = () => (
    <div className="settings-tab-content">
      <div className="settings-group">
        <h3>Анімації</h3>
        <div className="settings-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => handleSettingChange('animations', e.target.checked)}
            />
            Увімкнути анімації
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h3>Автозбереження</h3>
        <div className="settings-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
            Автоматично зберігати зміни
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-tab-content">
      <div className="settings-group">
        <h3>Сповіщення</h3>
        <div className="settings-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
            Увімкнути сповіщення
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h3>Дані</h3>
        <div className="settings-option">
          <button className="danger-button" onClick={() => {
            localStorage.clear();
            alert('Всі дані очищено');
          }}>
            Очистити всі дані
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-header">
          <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
        </div>

        {activeTab === 'appearance' && renderAppearanceTab()}
        {activeTab === 'behavior' && renderBehaviorTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}

        <div className="settings-footer">
          <button className="secondary-button" onClick={handleReset}>
            Скинути
          </button>
          <div className="button-group">
            <button className="secondary-button" onClick={onClose}>
              Скасувати
            </button>
            <button className="primary-button" onClick={handleSave}>
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

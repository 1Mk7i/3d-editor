'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Button,
  Slider,
  Divider,
  Stack,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

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
    theme: 'dark',
    language: 'uk',
    fontSize: 14,
    animations: true,
    notifications: true,
    autoSave: true,
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleSettingChange = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    console.log('Налаштування збережено:', settings);
    onClose?.();
  };

  const handleReset = () => {
    setSettings({
      theme: 'dark',
      language: 'uk',
      fontSize: 14,
      animations: true,
      notifications: true,
      autoSave: true,
    });
  };

  const handleClearData = () => {
    if (window.confirm('Ви впевнені, що хочете очистити всі дані?')) {
      localStorage.clear();
      alert('Всі дані очищено');
    }
  };

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
            icon={<PaletteIcon />}
            iconPosition="start"
            label="Вигляд"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="Поведінка"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            icon={<LockIcon />}
            iconPosition="start"
            label="Приватність"
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
            {activeTab === 0 && 'Вигляд'}
            {activeTab === 1 && 'Поведінка'}
            {activeTab === 2 && 'Приватність'}
          </Typography>
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {activeTab === 0 && (
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Тема</InputLabel>
                <Select
                  value={settings.theme}
                  label="Тема"
                  onChange={(e) => handleSettingChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
                >
                  <MenuItem value="light">Світла</MenuItem>
                  <MenuItem value="dark">Темна</MenuItem>
                  <MenuItem value="auto">Автоматично</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom>
                  Розмір шрифту: {settings.fontSize}px
                </Typography>
                <Slider
                  value={settings.fontSize}
                  onChange={(_, value) => handleSettingChange('fontSize', value as number)}
                  min={10}
                  max={20}
                  marks
                  step={1}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Мова інтерфейсу</InputLabel>
                <Select
                  value={settings.language}
                  label="Мова інтерфейсу"
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <MenuItem value="uk">Українська</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}

          {activeTab === 1 && (
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animations}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                  />
                }
                label="Увімкнути анімації"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                }
                label="Автоматично зберігати зміни"
              />
            </Stack>
          )}

          {activeTab === 2 && (
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                }
                label="Увімкнути сповіщення"
              />

              <Divider />

              <Button
                variant="outlined"
                color="error"
                onClick={handleClearData}
                fullWidth
              >
                Очистити всі дані
              </Button>
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button variant="outlined" onClick={handleReset}>
            Скинути
          </Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onClose}>
              Скасувати
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Зберегти
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;

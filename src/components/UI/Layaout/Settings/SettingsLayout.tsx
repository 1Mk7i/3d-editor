'use client';

import React, { useState, useEffect } from 'react';
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
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  ThreeDRotation as SceneIcon,
} from '@mui/icons-material';
import { useSettings } from '@/hooks/useSettings';

export interface SettingsProps {
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings: currentSettings, saveSettings, resetSettings, clearAllData } = useSettings();
  
  const [localSettings, setLocalSettings] = useState(currentSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    setLocalSettings(currentSettings);
  }, [currentSettings]);

  const handleSettingChange = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(localSettings);
    setShowSuccessMessage(true);
  };

  const handleReset = () => {
    resetSettings();
    setShowSuccessMessage(true);
  };

  const confirmClearData = () => {
    clearAllData();
    setShowClearDialog(false);
    setShowSuccessMessage(true);
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
            height: '100%',
            '& .MuiTab-root': {
              minHeight: 64,
              alignItems: 'center',
              justifyContent: 'flex-start',
              px: 2,
              textAlign: 'left'
            },
          }}
        >
          <Tab icon={<PaletteIcon />} iconPosition="start" label="Вигляд" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Поведінка" />
          <Tab icon={<LockIcon />} iconPosition="start" label="Приватність" />
          <Tab icon={<SceneIcon />} iconPosition="start" label="3D Сцена" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {activeTab === 0 && 'Вигляд'}
            {activeTab === 1 && 'Поведінка'}
            {activeTab === 2 && 'Приватність'}
            {activeTab === 3 && '3D Сцена'}
          </Typography>

          {activeTab === 0 && (
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Тема</InputLabel>
                <Select
                  value={localSettings.theme}
                  label="Тема"
                  onChange={(e) => handleSettingChange('theme', e.target.value as any)}
                >
                  <MenuItem value="light">Світла</MenuItem>
                  <MenuItem value="dark">Темна</MenuItem>
                  <MenuItem value="auto">Автоматично</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom>Розмір шрифту: {localSettings.fontSize}px</Typography>
                <Slider
                  value={localSettings.fontSize}
                  onChange={(_, value) => handleSettingChange('fontSize', value as number)}
                  min={10} max={20} step={1} marks
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Мова інтерфейсу</InputLabel>
                <Select
                  value={localSettings.language}
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
                control={<Switch checked={localSettings.animations} onChange={(e) => handleSettingChange('animations', e.target.checked)} />}
                label="Увімкнути анімації"
              />
              <Divider />
              <FormControlLabel
                control={<Switch checked={localSettings.autoSave} onChange={(e) => handleSettingChange('autoSave', e.target.checked)} />}
                label="Автоматично зберігати зміни"
              />
              {localSettings.autoSave && (
                <Box>
                  <Typography gutterBottom>Інтервал: {localSettings.autoSaveInterval}с</Typography>
                  <Slider
                    value={localSettings.autoSaveInterval}
                    onChange={(_, value) => handleSettingChange('autoSaveInterval', value as number)}
                    min={10} max={300} step={10}
                  />
                </Box>
              )}
            </Stack>
          )}

          {activeTab === 2 && (
            <Stack spacing={3}>
              <FormControlLabel
                control={<Switch checked={localSettings.notifications} onChange={(e) => handleSettingChange('notifications', e.target.checked)} />}
                label="Увімкнути сповіщення"
              />
              <Divider />
              <Button variant="outlined" color="error" onClick={() => setShowClearDialog(true)} fullWidth>
                Очистити всі дані
              </Button>
            </Stack>
          )}

          {activeTab === 3 && (
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="color"
                  label="Колір фону"
                  value={localSettings.sceneBackgroundColor}
                  onChange={(e) => handleSettingChange('sceneBackgroundColor', e.target.value)}
                  sx={{ width: 100 }}
                />
                <TextField
                  fullWidth
                  label="Hex код"
                  value={localSettings.sceneBackgroundColor}
                  onChange={(e) => handleSettingChange('sceneBackgroundColor', e.target.value)}
                />
              </Box>
              <Divider />
              <FormControlLabel
                control={<Switch checked={localSettings.gridVisible} onChange={(e) => handleSettingChange('gridVisible', e.target.checked)} />}
                label="Показати сітку"
              />
              <FormControl fullWidth>
                <InputLabel>Якість рендерингу</InputLabel>
                <Select
                  value={localSettings.renderQuality}
                  label="Якість рендерингу"
                  onChange={(e) => handleSettingChange('renderQuality', e.target.value as any)}
                >
                  <MenuItem value="low">Низька</MenuItem>
                  <MenuItem value="medium">Середня</MenuItem>
                  <MenuItem value="high">Висока</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={localSettings.shadows} onChange={(e) => handleSettingChange('shadows', e.target.checked)} />}
                label="Увімкнути тіні"
              />
            </Stack>
          )}
        </Box>

        {/* Action Footer */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            bgcolor: 'background.paper',
          }}
        >
          <Button variant="outlined" onClick={handleReset}>Скинути</Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleSave}>Зберегти</Button>
          </Stack>
        </Paper>
      </Box>

      {/* Messages & Dialogs */}
      <Snackbar open={showSuccessMessage} autoHideDuration={2000} onClose={() => setShowSuccessMessage(false)}>
        <Alert severity="success" variant="filled">Налаштування збережено!</Alert>
      </Snackbar>

      <Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
        <DialogTitle>Очистити все?</DialogTitle>
        <DialogContent>Це видалить всі ваші проекти та налаштування без можливості відновлення.</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>Скасувати</Button>
          <Button onClick={confirmClearData} color="error" variant="contained">Видалити все</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
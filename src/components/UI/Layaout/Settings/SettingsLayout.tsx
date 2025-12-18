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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  ThreeDRotation as SceneIcon,
} from '@mui/icons-material';
import { useSettings } from '@/hooks/useSettings';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export interface SettingsProps {
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings: currentSettings, saveSettings, resetSettings, clearAllData } = useSettings();
  const [localSettings, setLocalSettings] = useState<typeof currentSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Синхронізуємо локальний стан з поточними налаштуваннями при відкритті
  // Використовуємо useRef щоб не оновлювати при збереженні
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      setLocalSettings(currentSettings);
      isInitialMount.current = false;
    }
  }, []);

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
    const defaultSettings = {
      theme: 'dark' as const,
      language: 'uk',
      fontSize: 14,
      animations: true,
      notifications: true,
      autoSave: true,
      sceneBackgroundColor: '#121212',
      gridVisible: true,
      gridSize: 20,
      gridDivisions: 20,
      renderQuality: 'high' as const,
      shadows: true,
      antialiasing: true,
    };
    setLocalSettings(defaultSettings);
    resetSettings();
    setShowSuccessMessage(true);
  };

  const handleClearData = () => {
    setShowClearDialog(true);
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
          <Tab
            icon={<SceneIcon />}
            iconPosition="start"
            label="3D Сцена"
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
            {activeTab === 3 && '3D Сцена'}
          </Typography>
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {activeTab === 0 && (
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Тема</InputLabel>
                <Select
                  value={localSettings.theme}
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
                  Розмір шрифту: {localSettings.fontSize}px
                </Typography>
                <Slider
                  value={localSettings.fontSize}
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
                control={
                  <Switch
                    checked={localSettings.animations}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                  />
                }
                label="Увімкнути анімації"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.autoSave}
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
                    checked={localSettings.notifications}
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

          {activeTab === 3 && (
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Колір фону сцени</InputLabel>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                  <TextField
                    type="color"
                    value={localSettings.sceneBackgroundColor}
                    onChange={(e) => handleSettingChange('sceneBackgroundColor', e.target.value)}
                    sx={{ width: 80, height: 56 }}
                    InputProps={{
                      sx: { height: 56 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Hex код"
                    value={localSettings.sceneBackgroundColor}
                    onChange={(e) => handleSettingChange('sceneBackgroundColor', e.target.value)}
                    placeholder="#121212"
                  />
                </Box>
              </FormControl>

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.gridVisible}
                    onChange={(e) => handleSettingChange('gridVisible', e.target.checked)}
                  />
                }
                label="Показати сітку"
              />

              {localSettings.gridVisible && (
                <Box>
                  <Typography gutterBottom>
                    Розмір сітки: {localSettings.gridSize}
                  </Typography>
                  <Slider
                    value={localSettings.gridSize}
                    onChange={(_, value) => handleSettingChange('gridSize', value as number)}
                    min={5}
                    max={50}
                    marks
                    step={5}
                  />
                </Box>
              )}

              {localSettings.gridVisible && (
                <Box>
                  <Typography gutterBottom>
                    Кількість поділок: {localSettings.gridDivisions}
                  </Typography>
                  <Slider
                    value={localSettings.gridDivisions}
                    onChange={(_, value) => handleSettingChange('gridDivisions', value as number)}
                    min={5}
                    max={50}
                    marks
                    step={5}
                  />
                </Box>
              )}

              <Divider />

              <FormControl fullWidth>
                <InputLabel>Якість рендерингу</InputLabel>
                <Select
                  value={localSettings.renderQuality}
                  label="Якість рендерингу"
                  onChange={(e) => handleSettingChange('renderQuality', e.target.value as 'low' | 'medium' | 'high')}
                >
                  <MenuItem value="low">Низька</MenuItem>
                  <MenuItem value="medium">Середня</MenuItem>
                  <MenuItem value="high">Висока</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.shadows}
                    onChange={(e) => handleSettingChange('shadows', e.target.checked)}
                  />
                }
                label="Увімкнути тіні"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.antialiasing}
                    onChange={(e) => handleSettingChange('antialiasing', e.target.checked)}
                  />
                }
                label="Увімкнути згладжування"
              />
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

      {/* Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={2000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
          Налаштування збережено
        </Alert>
      </Snackbar>

      {/* Clear Data Dialog */}
      <Dialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
      >
        <DialogTitle>Очистити всі дані?</DialogTitle>
        <DialogContent>
          <Typography>
            Ви впевнені, що хочете очистити всі дані? Ця дія незворотна і видалить всі налаштування та збережені дані.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)}>
            Скасувати
          </Button>
          <Button onClick={confirmClearData} color="error" variant="contained">
            Очистити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

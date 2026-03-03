'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';

import { GeneralInfoTab } from './Tabs/GeneralInfoTab';
import { MouseTab } from './Tabs/MouseTab';
import { CreationTab } from './Tabs/CreationTab';
import { FileWorkTab } from './Tabs/FileWorkTab';
import { SettingsTab } from './Tabs/SettingsTab';
import { AgentTab } from './Tabs/AgentTab';
import {
  Help as HelpIcon,
  Mouse as MouseIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

export interface InstructionsProps {
  onClose?: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: Array<{ label: string; icon: React.ReactElement; component: React.ReactElement }> = [
    { label: 'Загальна інформація', icon: <HelpIcon />, component: <GeneralInfoTab /> },
    { label: 'Керування мишею', icon: <MouseIcon />, component: <MouseTab /> },
    { label: "Створення об'єктів", icon: <CategoryIcon />, component: <CreationTab /> },
    { label: 'Робота з файлами', icon: <FolderIcon />, component: <FileWorkTab /> },
    { label: 'Налаштування', icon: <SettingsIcon />, component: <SettingsTab /> },
    { label: 'AI Агент', icon: <HelpIcon />, component: <AgentTab /> },
  ];

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
              alignItems: 'center',
              justifyContent: 'flex-start',
              px: 2,
            },
          }}
        >
          {tabs.map((t, i) => (
            <Tab
              key={t.label}
              icon={t.icon}
              iconPosition="start"
              label={t.label}
              sx={{ textTransform: 'none' }}
            />
          ))}
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
          <Typography variant="h5">{tabs[activeTab]?.label}</Typography>
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>{tabs[activeTab]?.component}</Box>
        </Box>
      </Box>
  );
};


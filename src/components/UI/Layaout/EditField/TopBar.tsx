'use client';

import React, { useState } from 'react';
import { 
    AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Tooltip, Box, useTheme, Chip 
} from '@mui/material';
import { 
    Settings as SettingsIcon, 
    SmartToy as AIIcon, 
    Folder as FolderIcon, 
    Category as CategoryIcon, 
    Help as HelpIcon, 
    Fullscreen as FullscreenIcon, 
    FullscreenExit, 
    ViewSidebar as SidebarIcon,
    Timer as TimerIcon 
} from '@mui/icons-material';
import { ObjectSelectorMenu } from '../ObjectSelector/ObjectSelectorMenu';
import { ThreeObjectType } from '@/shared/constants/threeObjects';
import { WINDOW_CONFIG } from '@/config/editorConfig';

import { useTimerContext } from '@/context/TimerContext';

interface TopBarProps {
    isMobile: boolean;
    showRightMenu: boolean;
    setShowRightMenu: (show: boolean) => void;
    isFullscreen: boolean;
    isSupported: boolean;
    toggleFullscreen: () => void;
    handleOpenWindow: (id: keyof typeof WINDOW_CONFIG) => void;
    fileMenuAnchor: HTMLElement | null;
    handleFileMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleFileMenuClose: () => void;
    handleFileMenuClick: (operation: 'import' | 'export') => void;
    handleSaveProject: () => void;
    setWorkshopDialogOpen: (open: boolean) => void;
    handleObjectSelect: (objectType: ThreeObjectType) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
    isMobile,
    showRightMenu,
    setShowRightMenu,
    isFullscreen,
    isSupported,
    toggleFullscreen,
    handleOpenWindow,
    fileMenuAnchor,
    handleFileMenuOpen,
    handleFileMenuClose,
    handleFileMenuClick,
    handleSaveProject,
    setWorkshopDialogOpen,
    handleObjectSelect
}) => {
    const theme = useTheme();
    const [objectMenuAnchor, setObjectMenuAnchor] = useState<null | HTMLElement>(null);

    const { isActive: isTimerActive, seconds, formatTime } = useTimerContext();

    return (
        <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
                bgcolor: 'background.paper', 
                borderBottom: 1, 
                borderColor: 'divider', 
                zIndex: theme.zIndex.drawer + 1 
            }}
        >
            <Toolbar variant="dense">
                <Typography variant="h6" sx={{ mr: isMobile ? 1 : 2, fontSize: isMobile ? '0.9rem' : '1.25rem', color: 'text.primary', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    3D Editor
                </Typography>

                <Button startIcon={<FolderIcon />} onClick={handleFileMenuOpen} sx={{ color: 'text.primary', minWidth: isMobile ? 'auto' : '64px', px: isMobile ? 1 : 2 }}>
                    {!isMobile && "Файл"}
                </Button>

                <Button startIcon={<CategoryIcon />} onClick={(e) => setObjectMenuAnchor(e.currentTarget)} sx={{ color: 'text.primary', minWidth: isMobile ? 'auto' : '64px', px: isMobile ? 1 : 2 }}>
                    {!isMobile && "Об'єкт"}
                </Button>

                <ObjectSelectorMenu 
                    anchorEl={objectMenuAnchor} 
                    open={Boolean(objectMenuAnchor)} 
                    onClose={() => setObjectMenuAnchor(null)} 
                    onSelect={(objectType) => {
                        handleObjectSelect(objectType); 
                        setObjectMenuAnchor(null);
                    }}
                />

                <Button startIcon={<HelpIcon />} onClick={() => handleOpenWindow('instructions')} sx={{ color: 'text.primary', minWidth: isMobile ? 'auto' : '64px' }}>
                    {!isMobile && "Інструкція"}
                </Button>
                
                <Menu anchorEl={fileMenuAnchor} open={Boolean(fileMenuAnchor)} onClose={handleFileMenuClose}>
                    <MenuItem onClick={() => handleFileMenuClick('import')}>Імпорт моделі</MenuItem>
                    <MenuItem onClick={() => handleFileMenuClick('export')}>Експорт моделі</MenuItem>
                    <MenuItem onClick={handleSaveProject}>Зберегти проект</MenuItem>
                    <MenuItem onClick={() => { setWorkshopDialogOpen(true); handleFileMenuClose(); }}>Майстерня</MenuItem>
                </Menu>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                    
                    <Tooltip title={isTimerActive ? `Таймер запущено: ${formatTime(seconds)}` : "Таймер сесії"}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {isTimerActive && !isMobile && (
                                <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {formatTime(seconds).split(':').slice(1).join(':')}
                                </Typography>
                            )}
                            <IconButton 
                                onClick={() => handleOpenWindow('timer')}
                                sx={{ 
                                    width: isMobile ? 36 : 32, 
                                    height: isMobile ? 36 : 32,
                                    color: isTimerActive ? '#4caf50' : 'text.secondary',
                                    bgcolor: isTimerActive ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': { 
                                        color: isTimerActive ? '#66bb6a' : 'primary.main',
                                        bgcolor: isTimerActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <TimerIcon fontSize={isMobile ? "medium" : "small"} />
                            </IconButton>
                        </Box>
                    </Tooltip>

                    {isSupported && (
                        <IconButton 
                            onClick={toggleFullscreen}
                            sx={{ 
                                width: isMobile ? 36 : 32, 
                                height: isMobile ? 36 : 32,
                                color: isFullscreen ? 'primary.main' : 'text.secondary'
                            }}
                        >
                            {isFullscreen ? <FullscreenExit fontSize={isMobile ? "medium" : "small"} /> : <FullscreenIcon fontSize={isMobile ? "medium" : "small"} />}
                        </IconButton>
                    )}

                    <Tooltip title={showRightMenu ? "Сховати панель" : "Показати панель"}>
                        <IconButton 
                            onClick={() => setShowRightMenu(!showRightMenu)} 
                            sx={{ 
                                color: showRightMenu ? 'primary.main' : 'text.secondary',
                                bgcolor: showRightMenu ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                width: isMobile ? 36 : 32,
                                height: isMobile ? 36 : 32,
                            }}
                        >
                            <SidebarIcon fontSize={isMobile ? "medium" : "small"} />
                        </IconButton>
                    </Tooltip>

                    <IconButton 
                        onClick={() => handleOpenWindow('settings')}
                        sx={{ 
                            width: isMobile ? 36 : 32, 
                            height: isMobile ? 36 : 32,
                            color: 'text.secondary'
                        }}
                    >
                        <SettingsIcon fontSize={isMobile ? "medium" : "small"} />
                    </IconButton>

                    <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<AIIcon />} 
                        onClick={() => handleOpenWindow('chat')}
                        sx={{ 
                            ml: 0.5, 
                            px: isMobile ? 1 : 2, 
                            minWidth: isMobile ? 'auto' : '80px',
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            textTransform: 'none',
                            borderRadius: '6px'
                        }}
                    >
                        {isMobile ? "AI" : "AI Chat"}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
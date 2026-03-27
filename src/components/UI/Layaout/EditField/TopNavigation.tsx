'use client';

import React from 'react';
import { 
    Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
    IconButton, Tooltip, Divider, Stack, useTheme 
} from '@mui/material';
import {
    Settings as SettingsIcon,
    SmartToy as AIIcon,
    Folder as FolderIcon,
    Category as CategoryIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit,
    CloudUpload as ImportIcon,
    CloudDownload as ExportIcon,
    Save as SaveIcon,
    LibraryBooks as LibraryIcon
} from '@mui/icons-material';
import { ObjectSelectorMenu } from '../ObjectSelector/ObjectSelectorMenu';

interface TopNavigationProps {
    isMobile: boolean;
    isFullscreen: boolean;
    isSupported: boolean;
    toggleFullscreen: () => void | Promise<void>;
    fileMenuAnchor: HTMLElement | null;
    handleFileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleFileMenuClose: () => void;
    handleFileMenuClick: (operation: any) => void;
    handleSaveProject: () => void;
    setWorkshopDialogOpen: (open: boolean) => void;
    objectMenuAnchor: HTMLElement | null;
    setObjectMenuAnchor: (el: HTMLElement | null) => void;
    handleObjectSelect: (type: any) => void;
    handleOpenWindow: (id: any) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
    isMobile, isFullscreen, isSupported, toggleFullscreen,
    fileMenuAnchor, handleFileMenuOpen, handleFileMenuClose, handleFileMenuClick,
    handleSaveProject, setWorkshopDialogOpen,
    objectMenuAnchor, setObjectMenuAnchor, handleObjectSelect,
    handleOpenWindow
}) => {
    const theme = useTheme();

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
            <Toolbar variant="dense" sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mr: 2, 
                        fontWeight: 700, 
                        fontSize: isMobile ? '1.1rem' : '1.25rem', 
                        color: 'text.primary',
                        letterSpacing: '0.02em' 
                    }}
                >
                    3D EDITOR
                </Typography>

                <Stack direction="row" spacing={0.5}>
                    <Button 
                        startIcon={<FolderIcon />} 
                        onClick={handleFileMenuOpen} 
                        size="small"
                        sx={{ color: 'text.primary', px: 1.5 }}
                    >
                        {!isMobile && "Файл"}
                    </Button>

                    <Button 
                        startIcon={<CategoryIcon />} 
                        onClick={(e) => setObjectMenuAnchor(e.currentTarget)} 
                        size="small"
                        sx={{ color: 'text.primary', px: 1.5 }}
                    >
                        {!isMobile && "Об'єкт"}
                    </Button>
                </Stack>
                
                <Menu
                    anchorEl={fileMenuAnchor}
                    open={Boolean(fileMenuAnchor)}
                    onClose={handleFileMenuClose}
                    disableScrollLock
                    PaperProps={{ 
                        sx: { 
                            minWidth: 200, 
                            borderRadius: '4px',
                            mt: 0.5, 
                            border: '1px solid', 
                            borderColor: 'divider', 
                            boxShadow: theme.shadows[3] 
                        } 
                    }}
                >
                    <MenuItem onClick={() => handleFileMenuClick('import')} sx={{ py: 1, px: 2 }}>
                        <ImportIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }} />
                        <Typography variant="body2">Імпортувати модель</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleFileMenuClick('export')} sx={{ py: 1, px: 2 }}>
                        <ExportIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }} />
                        <Typography variant="body2">Експортувати сцену</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { handleSaveProject(); handleFileMenuClose(); }} sx={{ py: 1, px: 2 }}>
                        <SaveIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }} />
                        <Typography variant="body2">Зберегти проект</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setWorkshopDialogOpen(true); handleFileMenuClose(); }} sx={{ py: 1, px: 2 }}>
                        <LibraryIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }} />
                        <Typography variant="body2">Бібліотека</Typography>
                    </MenuItem>
                </Menu>

                <ObjectSelectorMenu 
                    anchorEl={objectMenuAnchor} 
                    open={Boolean(objectMenuAnchor)} 
                    onClose={() => setObjectMenuAnchor(null)} 
                    onSelect={handleObjectSelect} 
                />

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" spacing={1} alignItems="center">
                    {isSupported && (
                        <IconButton size="small" onClick={toggleFullscreen} sx={{ color: 'text.primary' }}>
                            {isFullscreen ? <FullscreenExit fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                        </IconButton>
                    )}
                    
                    <IconButton 
                        size="small" 
                        onClick={() => handleOpenWindow('settings')} 
                        sx={{ color: 'text.primary' }}
                    >
                        <SettingsIcon fontSize="small" />
                    </IconButton>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AIIcon />}
                        onClick={() => handleOpenWindow('chat')}
                        disableElevation
                        sx={{ 
                            ml: 1, 
                            borderRadius: '4px',
                            textTransform: 'none',
                            fontWeight: 600 
                        }}
                    >
                        {isMobile ? "AI" : "AI Chat"}
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
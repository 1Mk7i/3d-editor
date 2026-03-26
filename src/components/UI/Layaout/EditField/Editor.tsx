'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
    Box, AppBar, Toolbar, Typography, Button, 
    Menu, MenuItem, IconButton, Tooltip, useTheme 
} from '@mui/material';
import {
    Settings as SettingsIcon,
    SmartToy as AIIcon,
    Folder as FolderIcon,
    Category as CategoryIcon,
    Help as HelpIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit,
} from '@mui/icons-material';

// Components
import ThreeScene from '@/components/UI/Scene/ThreeScene';
import { ContextMenu } from '@/components/ContextMenu/ContextMenu';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Layaout/Settings/SettingsLayout';
import { Chat } from '@/components/UI/Layaout/Chat/ChatLayout';
import { Instructions } from '@/components/UI/Layaout/Instructions/InstructionsLayout';
import { LeftMenu } from '../LeftMenu';
import { RightMenu } from '../RightMenu';
import { FileDialog } from '../FileMenu/FileDialog';
import { WorkshopDialog } from '../FileMenu/WorkshopDialog';
import { ObjectSelectorMenu } from '../ObjectSelector/ObjectSelectorMenu';
import { ObjectSelectorDialog } from '../ObjectSelector/ObjectSelectorDialog';

// Hooks & Config
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/useSceneManager';
import { useSettings } from '@/hooks/useSettings';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useFullscreen } from '@/hooks/useFullscreen';
import useSceneTree from '@/hooks/useSceneTree';
import { useFileOperations } from './useFileOperations';
import { useObjectUpdate } from './useObjectUpdate';
import { useAgentCommands } from './useAgentCommands';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import { WINDOW_CONFIG, UI_DIMENSIONS } from '@/config/editorConfig';

const Editor: React.FC = () => {
    const theme = useTheme();
    const isMobile = useIsMobile();
    const { settings } = useSettings();
    const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

    // Managers & Hooks
    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();

    // Local State
    const [isMounted, setIsMounted] = useState(false);
    const [objectMenuAnchor, setObjectMenuAnchor] = useState<null | HTMLElement>(null);
    const [objectSelectorDialogOpen, setObjectSelectorDialogOpen] = useState(false);

    // Business Logic
    const {
        fileMenuAnchor, fileDialogOpen, fileOperation,
        workshopDialogOpen, setWorkshopDialogOpen,
        handleFileMenuOpen, handleFileMenuClose, handleFileMenuClick,
        handleFileDialogClose, handleFileConfirm,
        handleSaveProject, handleLoadProject,
    } = useFileOperations(sceneManager);

    const { handleColorChange, handleUpdateObject, handleObjectSelect } = useObjectUpdate(sceneManager);
    const { handleAgentCommand } = useAgentCommands(sceneManager, handleUpdateObject);

    // Memoized Context Menu
    const menuItems = useMemo(() => createContextMenuItems(
        windowManager.openWindow,
        sceneManager,
        !!sceneManager.clipboard,
        sceneManager.clipboard?.type,
        sceneManager.clipboard?.subType,
        {
            copy: sceneManager.copyToClipboard,
            paste: sceneManager.pasteFromClipboard,
            duplicate: sceneManager.duplicateObject
        }
    ), [windowManager.openWindow, sceneManager.clipboard, sceneManager.selectedObjectId, sceneManager]);

    // Lifecycle
    useEffect(() => {
        setIsMounted(true);
        if (isMobile) document.documentElement.classList.add('mobile-fullscreen');
    }, [isMobile]);

    useEffect(() => {
        sceneTree.updateTree(sceneManager.getTreeScene() as any);
    }, [sceneManager.objects, sceneManager, sceneTree]);

    const handleOpenWindow = useCallback((id: keyof typeof WINDOW_CONFIG) => {
        const config = WINDOW_CONFIG[id];
        windowManager.openWindow(id, {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: config.defaultX, y: config.defaultY },
            size: isMobile 
                ? { width: window.innerWidth, height: window.innerHeight } 
                : { width: config.width, height: config.height },
        });
    }, [windowManager, isMobile]);

    const handleOnContextMenu = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.MuiAppBar-root') || target.closest('.MuiMenu-root') || target.closest('.MuiDialog-root')) return;
        contextMenu.showContextMenu(e);
    }, [contextMenu]);

    if (!isMounted) return null;

    return (
        <Box
            sx={{
                position: 'fixed', inset: 0,
                display: 'flex', flexDirection: 'column',
                bgcolor: 'background.default',
                color: 'text.primary',
                overflow: 'hidden',
                ...(isMobile && { width: '100vw', height: '100vh' }),
            }}
            onContextMenu={handleOnContextMenu}
        >
            {/* Navigation Bar */}
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
                    <Typography variant="h6" sx={{ 
                        mr: 2, 
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                        color: 'text.primary'
                    }}>
                        3D Editor
                    </Typography>

                    <Button 
                        startIcon={<FolderIcon />} 
                        onClick={handleFileMenuOpen}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        {!isMobile && "Файл"}
                    </Button>

                    <Button 
                        startIcon={<CategoryIcon />} 
                        onClick={(e) => setObjectMenuAnchor(e.currentTarget)}
                        sx={{ color: 'text.primary', mr: 1 }}
                    >
                        {!isMobile && "Об'єкт"}
                    </Button>
                    
                    <ObjectSelectorMenu 
                        anchorEl={objectMenuAnchor} 
                        open={Boolean(objectMenuAnchor)} 
                        onClose={() => setObjectMenuAnchor(null)} 
                        onSelect={handleObjectSelect} 
                    />
                    
                    {!isMobile && (
                        <Button 
                            startIcon={<HelpIcon />} 
                            onClick={() => handleOpenWindow('instructions')}
                            sx={{ color: 'text.primary', mr: 1 }}
                        >
                            Інструкція
                        </Button>
                    )}

                    <Menu anchorEl={fileMenuAnchor} open={Boolean(fileMenuAnchor)} onClose={handleFileMenuClose}>
                        <MenuItem onClick={() => handleFileMenuClick('import')}>Імпорт моделі</MenuItem>
                        <MenuItem onClick={() => handleFileMenuClick('export')}>Експорт моделі</MenuItem>
                        <MenuItem onClick={handleSaveProject}>Зберегти проект</MenuItem>
                        <MenuItem onClick={() => setWorkshopDialogOpen(true)}>Майстерня</MenuItem>
                    </Menu>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isSupported && (
                            <Tooltip title={isFullscreen ? 'Вийти' : 'Повний екран'}>
                                <IconButton size="small" onClick={toggleFullscreen} sx={{ color: 'text.primary' }}>
                                    {isFullscreen ? <FullscreenExit /> : <FullscreenIcon />}
                                </IconButton>
                            </Tooltip>
                        )}
                        <IconButton size="small" onClick={() => handleOpenWindow('settings')} sx={{ color: 'text.primary' }}>
                            <SettingsIcon />
                        </IconButton>
                        
                        <Button variant="contained" size="small" startIcon={<AIIcon />} onClick={() => handleOpenWindow('chat')} sx={{ ml: 1 }}>
                            AI Chat
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Workplace */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                <LeftMenu
                    isEditMode={sceneManager.isEditMode}
                    selectedObjectId={sceneManager.selectedObjectId}
                    onAddObject={() => setObjectSelectorDialogOpen(true)}
                    onToggleEditMode={sceneManager.toggleEditMode}
                    onSetTransformMode={sceneManager.setTransformMode}
                    onRemoveObject={sceneManager.removeObject}
                    onColorChange={handleColorChange}
                />

                <Box sx={{ 
                    flex: 1, 
                    position: 'relative', 
                    overflow: 'hidden', 
                    bgcolor: theme.palette.editor.sceneBackground // Динамічний фон з теми
                }}>
                    <ThreeScene
                        objects={sceneManager.objects}
                        selectObject={sceneManager.selectObject}
                        selectedObjectId={sceneManager.selectedObjectId}
                        clearSelection={sceneManager.clearSelection}
                        isEditMode={sceneManager.isEditMode}
                        transformMode={sceneManager.transformMode}
                        settings={settings}
                    />
                </Box>

                {!isMobile && (
                    <Box sx={{ 
                        width: UI_DIMENSIONS.RIGHT_MENU_WIDTH, 
                        borderLeft: 1, 
                        borderColor: 'divider', 
                        bgcolor: 'background.paper' 
                    }}>
                        <RightMenu
                            treeData={sceneTree.treeData}
                            onUpdateTree={sceneTree.updateTree}
                            selectedObjectId={sceneManager.selectedObjectId}
                            objects={sceneManager.objects}
                            onSelectObject={sceneManager.selectObject}
                            onUpdateObject={handleUpdateObject}
                        />
                    </Box>
                )}
            </Box>

            {/* Overlays */}
            <ContextMenu 
                isVisible={contextMenu.isVisible} 
                position={contextMenu.position} 
                items={menuItems} 
                onClose={contextMenu.hideContextMenu} 
            />

            <FileDialog 
                open={fileDialogOpen} 
                operation={fileOperation} 
                onClose={handleFileDialogClose} 
                onConfirm={handleFileConfirm} 
                objectsCount={sceneManager.objects.length} 
            />
            <WorkshopDialog 
                open={workshopDialogOpen} 
                onClose={() => setWorkshopDialogOpen(false)} 
                onLoadProject={handleLoadProject} 
            />
            <ObjectSelectorDialog 
                open={objectSelectorDialogOpen} 
                onClose={() => setObjectSelectorDialogOpen(false)} 
                onSelect={handleObjectSelect} 
            />

            {/* Floating Windows */}
            {windowManager.windows.map(win => (
                <Window 
                    key={win.id} {...win} 
                    title={WINDOW_CONFIG[win.id as keyof typeof WINDOW_CONFIG]?.title || 'Вікно'}
                    onClose={() => windowManager.closeWindow(win.id)} 
                    onMinimize={() => windowManager.minimizeWindow(win.id)}
                    onMaximize={() => windowManager.maximizeWindow(win.id)} 
                    onRestore={() => windowManager.restoreWindow(win.id)}
                    onFocus={() => windowManager.focusWindow(win.id)}
                >
                    {win.id === 'settings' && <Settings onClose={() => windowManager.closeWindow('settings')} />}
                    {win.id === 'chat' && (
                        <Chat 
                            onClose={() => windowManager.closeWindow('chat')} 
                            onAgentCommand={handleAgentCommand} 
                            selectedObjectId={sceneManager.selectedObjectId} 
                            objects={sceneManager.objects} 
                        />
                    )}
                    {win.id === 'instructions' && <Instructions onClose={() => windowManager.closeWindow('instructions')} />}
                </Window>
            ))}
        </Box>
    );
};

export default Editor;
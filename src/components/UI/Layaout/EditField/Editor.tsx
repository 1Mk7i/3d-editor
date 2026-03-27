'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Tooltip, useTheme } from '@mui/material';
import { Settings as SettingsIcon, SmartToy as AIIcon, Folder as FolderIcon, Category as CategoryIcon, Help as HelpIcon, Fullscreen as FullscreenIcon, FullscreenExit } from '@mui/icons-material';

// Components
import { Workplace } from './Workplace';
import { ContextMenu } from '@/components/ContextMenu/ContextMenu';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Layaout/Settings/SettingsLayout';
import { Chat } from '@/components/UI/Layaout/Chat/ChatLayout';
import { Instructions } from '@/components/UI/Layaout/Instructions/InstructionsLayout';
import { FileDialog } from '../FileMenu/FileDialog';
import { WorkshopDialog } from '../FileMenu/WorkshopDialog';
import { ObjectSelectorMenu } from '../ObjectSelector/ObjectSelectorMenu';
import { ObjectSelectorDialog } from '../ObjectSelector/ObjectSelectorDialog';

// Hooks
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
import { WINDOW_CONFIG } from '@/config/editorConfig';

const Editor: React.FC = () => {
    const theme = useTheme();
    const isMobile = useIsMobile();
    const { settings } = useSettings();
    const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();

    const [isMounted, setIsMounted] = useState(false);
    const [objectMenuAnchor, setObjectMenuAnchor] = useState<null | HTMLElement>(null);
    const [objectSelectorDialogOpen, setObjectSelectorDialogOpen] = useState(false);

    const {
        fileMenuAnchor, fileDialogOpen, fileOperation, workshopDialogOpen, setWorkshopDialogOpen,
        handleFileMenuOpen, handleFileMenuClose, handleFileMenuClick,
        handleFileDialogClose, handleFileConfirm, handleSaveProject, handleLoadProject,
    } = useFileOperations(sceneManager);

    const { handleColorChange, handleUpdateObject, handleObjectSelect } = useObjectUpdate(sceneManager);
    const { handleAgentCommand } = useAgentCommands(sceneManager, handleUpdateObject);

    const menuItems = useMemo(() => createContextMenuItems(
        windowManager.openWindow, sceneManager, !!sceneManager.clipboard, 
        sceneManager.clipboard?.type, sceneManager.clipboard?.subType,
        { copy: sceneManager.copyToClipboard, paste: sceneManager.pasteFromClipboard, duplicate: sceneManager.duplicateObject }
    ), [windowManager.openWindow, sceneManager.clipboard, sceneManager.selectedObjectId, sceneManager]);

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
            size: isMobile ? { width: window.innerWidth, height: window.innerHeight } : { width: config.width, height: config.height },
        });
    }, [windowManager, isMobile]);

    const handleOnContextMenu = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.MuiAppBar-root') || target.closest('.MuiMenu-root') || target.closest('.MuiDialog-root')) return;
        contextMenu.showContextMenu(e);
    }, [contextMenu]);

    if (!isMounted) return null;

    return (
        <Box sx={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }} onContextMenu={handleOnContextMenu}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar variant="dense">
                    <Typography variant="h6" sx={{ mr: 2, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>3D Editor</Typography>
                    <Button startIcon={<FolderIcon />} onClick={handleFileMenuOpen} sx={{ color: 'text.primary' }}>{!isMobile && "Файл"}</Button>
                    <Button startIcon={<CategoryIcon />} onClick={(e) => setObjectMenuAnchor(e.currentTarget)} sx={{ color: 'text.primary' }}>{!isMobile && "Об'єкт"}</Button>
                    <ObjectSelectorMenu anchorEl={objectMenuAnchor} open={Boolean(objectMenuAnchor)} onClose={() => setObjectMenuAnchor(null)} onSelect={handleObjectSelect} />
                    {!isMobile && <Button startIcon={<HelpIcon />} onClick={() => handleOpenWindow('instructions')} sx={{ color: 'text.primary' }}>Інструкція</Button>}
                    <Menu anchorEl={fileMenuAnchor} open={Boolean(fileMenuAnchor)} onClose={handleFileMenuClose}>
                        <MenuItem onClick={() => handleFileMenuClick('import')}>Імпорт моделі</MenuItem>
                        <MenuItem onClick={() => handleFileMenuClick('export')}>Експорт моделі</MenuItem>
                        <MenuItem onClick={handleSaveProject}>Зберегти проект</MenuItem>
                        <MenuItem onClick={() => setWorkshopDialogOpen(true)}>Майстерня</MenuItem>
                    </Menu>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ gap: 1, display: 'flex' }}>
                        {isSupported && (
                            <IconButton size="small" onClick={toggleFullscreen}>
                                {isFullscreen ? <FullscreenExit /> : <FullscreenIcon />}
                            </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleOpenWindow('settings')}><SettingsIcon /></IconButton>
                        <Button variant="contained" size="small" startIcon={<AIIcon />} onClick={() => handleOpenWindow('chat')}>AI Chat</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Workplace */}
            <Workplace
                isMobile={isMobile}
                sceneManager={sceneManager}
                sceneTree={sceneTree}
                settings={settings}
                handleColorChange={handleColorChange}
                handleUpdateObject={handleUpdateObject}
                setObjectSelectorDialogOpen={setObjectSelectorDialogOpen}
            />

            {/* Overlays & Windows */}
            <ContextMenu isVisible={contextMenu.isVisible} position={contextMenu.position} items={menuItems} onClose={contextMenu.hideContextMenu} />
            <FileDialog open={fileDialogOpen} operation={fileOperation} onClose={handleFileDialogClose} onConfirm={handleFileConfirm} objectsCount={sceneManager.objects.length} />
            <WorkshopDialog open={workshopDialogOpen} onClose={() => setWorkshopDialogOpen(false)} onLoadProject={handleLoadProject} />
            <ObjectSelectorDialog open={objectSelectorDialogOpen} onClose={() => setObjectSelectorDialogOpen(false)} onSelect={handleObjectSelect} />

            {windowManager.windows.map(win => (
                <Window key={win.id} {...win} title={WINDOW_CONFIG[win.id as keyof typeof WINDOW_CONFIG]?.title || 'Вікно'} onClose={() => windowManager.closeWindow(win.id)}>
                    {win.id === 'settings' && <Settings onClose={() => windowManager.closeWindow('settings')} />}
                    {win.id === 'chat' && <Chat onClose={() => windowManager.closeWindow('chat')} onAgentCommand={handleAgentCommand} selectedObjectId={sceneManager.selectedObjectId} objects={sceneManager.objects} />}
                    {win.id === 'instructions' && <Instructions onClose={() => windowManager.closeWindow('instructions')} />}
                </Window>
            ))}
        </Box>
    );
};

export default Editor;
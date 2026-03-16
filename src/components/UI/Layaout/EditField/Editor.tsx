'use client';

import React from 'react';
import ThreeScene from '@/components/UI/Scene/ThreeScene';
import { ContextMenu } from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/useSceneManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import useSceneTree from '@/hooks/useSceneTree';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Layaout/Settings/SettingsLayout';
import { Chat } from '@/components/UI/Layaout/Chat/ChatLayout';
import { Instructions } from '@/components/UI/Layaout/Instructions/InstructionsLayout';
import { LeftMenu } from '../LeftMenu';
import { RightMenu } from '../RightMenu';
import {
    Box, AppBar, Toolbar, Typography, Button,
    Menu, MenuItem, IconButton, Tooltip,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    SmartToy as AIIcon,
    Folder as FolderIcon,
    Category as CategoryIcon,
    Help as HelpIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useSettings } from '@/hooks/useSettings';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useFullscreen } from '@/hooks/useFullscreen';
import { FileDialog } from '../FileMenu/FileDialog';
import { WorkshopDialog } from '../FileMenu/WorkshopDialog';
import { ObjectSelectorMenu } from '../ObjectSelector/ObjectSelectorMenu';
import { ObjectSelectorDialog } from '../ObjectSelector/ObjectSelectorDialog';
import { useFileOperations } from './useFileOperations';
import { useObjectUpdate } from './useObjectUpdate';
import { useAgentCommands } from './useAgentCommands';

const Editor: React.FC = () => {
    // 1. Ініціалізація всіх хуків (мають бути на самому початку)
    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();
    const { settings } = useSettings();
    const isMobile = useIsMobile();
    const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

    const [isMounted, setIsMounted] = React.useState(false);
    const [isRightMenuVisible, setIsRightMenuVisible] = React.useState(true);
    const [objectMenuAnchor, setObjectMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [objectSelectorDialogOpen, setObjectSelectorDialogOpen] = React.useState(false);

    const {
        fileMenuAnchor, fileDialogOpen, fileOperation,
        workshopDialogOpen, setWorkshopDialogOpen,
        handleFileMenuOpen, handleFileMenuClose, handleFileMenuClick,
        handleFileDialogClose, handleFileConfirm,
        handleSaveProject, handleLoadProject,
    } = useFileOperations(sceneManager);

    const { handleColorChange, handleUpdateObject, handleObjectSelect } = useObjectUpdate(sceneManager);
    const { handleAgentCommand } = useAgentCommands(sceneManager, handleUpdateObject);

    // 2. Створення пунктів меню (useMemo має бути вище за будь-який return)
    const menuItems = React.useMemo(() => createContextMenuItems(
        windowManager.openWindow,
        sceneManager,
        !!sceneManager.clipboard,
        {
            copy: sceneManager.copyToClipboard,
            paste: sceneManager.pasteFromClipboard,
            duplicate: sceneManager.duplicateObject
        }
    ), [windowManager.openWindow, sceneManager]);

    // 3. Ефекти
    React.useEffect(() => {
        setIsMounted(true);
        if (isMobile) {
            document.documentElement.classList.add('mobile-fullscreen');
        }
    }, [isMobile]);

    React.useEffect(() => {
        sceneTree.updateTree(sceneManager.getTreeScene());
    }, [sceneManager.objects, sceneTree, sceneManager]);

    // Гарячі клавіші для копіювання/вставки
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        if (sceneManager.selectedObjectId) sceneManager.copyToClipboard(sceneManager.selectedObjectId);
                        break;
                    case 'v':
                        sceneManager.pasteFromClipboard();
                        break;
                    case 'd':
                        e.preventDefault();
                        if (sceneManager.selectedObjectId) sceneManager.duplicateObject(sceneManager.selectedObjectId);
                        break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sceneManager]);

    // 4. Обробники подій
    const handleSettingsClick = React.useCallback(() => {
        windowManager.openWindow('settings', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 100, y: 100 },
            size: isMobile
                ? { width: window.innerWidth, height: window.innerHeight }
                : { width: 600, height: 400 },
        });
        if (isMobile) windowManager.maximizeWindow('settings');
    }, [windowManager, isMobile]);

    const handleInstructionsClick = React.useCallback(() => {
        windowManager.openWindow('instructions', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 150, y: 150 },
            size: isMobile
                ? { width: window.innerWidth, height: window.innerHeight }
                : { width: 800, height: 600 },
        });
        if (isMobile) windowManager.maximizeWindow('instructions');
    }, [windowManager, isMobile]);

    const handleChatClick = React.useCallback(() => {
        windowManager.openWindow('chat', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 150, y: 150 },
            size: isMobile
                ? { width: window.innerWidth, height: window.innerHeight }
                : { width: 400, height: 600 },
        });
        if (isMobile) windowManager.maximizeWindow('chat');
    }, [windowManager, isMobile]);

    const handleObjectMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        setObjectMenuAnchor(event.currentTarget);
    }, []);

    const handleObjectMenuClose = React.useCallback(() => {
        setObjectMenuAnchor(null);
    }, []);

    // 5. Умовний рендер (ТІЛЬКИ ПІСЛЯ ВСІХ ХУКІВ)
    if (!isMounted) return null;

    return (
        <Box
            component="div"
            sx={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                bgcolor: 'background.default',
                overflow: 'hidden',
                ...(isMobile && { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }),
            }}
            className={isMobile ? 'mobile-fullscreen-container' : ''}
            onContextMenu={contextMenu.showContextMenu}
        >
            {/* AppBar */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ color: 'text.primary', mr: 2 }}>
                        3D Editor
                    </Typography>

                    <Button color="inherit" startIcon={<FolderIcon />} onClick={handleFileMenuOpen} sx={{ color: 'text.primary', mr: 1 }}>
                        Файл
                    </Button>
                    <Button color="inherit" startIcon={<CategoryIcon />} onClick={handleObjectMenuOpen} sx={{ color: 'text.primary', mr: 1 }}>
                        Об'єкт
                    </Button>
                    <ObjectSelectorMenu
                        anchorEl={objectMenuAnchor}
                        open={Boolean(objectMenuAnchor)}
                        onClose={handleObjectMenuClose}
                        onSelect={handleObjectSelect}
                    />
                    <Button color="inherit" startIcon={<HelpIcon />} onClick={handleInstructionsClick} sx={{ color: 'text.primary', mr: 1 }}>
                        Інструкція
                    </Button>

                    <Menu
                        anchorEl={fileMenuAnchor}
                        open={Boolean(fileMenuAnchor)}
                        onClose={handleFileMenuClose}
                        PaperProps={{
                            sx: {
                                maxHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 200px)',
                                width: 'auto',
                                minWidth: 200,
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleFileMenuClick('import')}>Імпорт моделі</MenuItem>
                        <MenuItem onClick={() => handleFileMenuClick('export')}>Експорт моделі</MenuItem>
                        <MenuItem onClick={() => { handleSaveProject(); handleFileMenuClose(); }}>Зберегти</MenuItem>
                        <MenuItem onClick={() => { setWorkshopDialogOpen(true); handleFileMenuClose(); }}>Майстерня</MenuItem>
                    </Menu>

                    <Box sx={{ flexGrow: 1 }} />

                    {isMobile && isSupported && (
                        <Tooltip title={isFullscreen ? 'Вийти' : 'Увійти в повний екран'}>
                            <IconButton onClick={toggleFullscreen} sx={{ color: 'text.primary', mr: 1 }}>
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button color="inherit" startIcon={<SettingsIcon />} onClick={handleSettingsClick} sx={{ color: 'text.primary', mr: 1 }}>
                        Налаштування
                    </Button>
                    <Button color="inherit" startIcon={<AIIcon />} onClick={handleChatClick} sx={{ color: 'text.primary' }}>
                        AI
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minWidth: 0 }}>
                <LeftMenu
                    isEditMode={sceneManager.isEditMode}
                    selectedObjectId={sceneManager.selectedObjectId}
                    onAddObject={() => setObjectSelectorDialogOpen(true)}
                    onToggleEditMode={sceneManager.toggleEditMode}
                    onSetTransformMode={sceneManager.setTransformMode}
                    onRemoveObject={sceneManager.removeObject}
                    onColorChange={handleColorChange}
                />

                <Box sx={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
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

                <Box sx={{ width: isRightMenuVisible ? (isMobile ? '40%' : 300) : 0, overflow: 'hidden', transition: 'width 0.3s ease', flexShrink: 0 }}>
                    {isRightMenuVisible && (
                        <RightMenu
                            treeData={sceneTree.treeData}
                            onUpdateTree={sceneTree.updateTree}
                            selectedObjectId={sceneManager.selectedObjectId}
                            objects={sceneManager.objects}
                            onSelectObject={sceneManager.selectObject}
                            onUpdateObject={handleUpdateObject}
                        />
                    )}
                </Box>
            </Box>

            {/* Context Menu */}
            <ContextMenu
                isVisible={contextMenu.isVisible}
                position={contextMenu.position}
                items={menuItems}
                onClose={contextMenu.hideContextMenu}
            />

            {/* Dialogs */}
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

            {/* Floating windows */}
            {windowManager.windows.map(win => {
                const commonProps = {
                    key: win.id,
                    id: win.id,
                    isVisible: win.isVisible,
                    isMinimized: win.isMinimized,
                    isMaximized: win.isMaximized,
                    initialPosition: win.position,
                    initialSize: win.size,
                    resizable: true,
                    draggable: true,
                    zIndex: win.zIndex,
                    onClose: () => windowManager.closeWindow(win.id),
                    onMinimize: () => windowManager.minimizeWindow(win.id),
                    onMaximize: () => windowManager.maximizeWindow(win.id),
                    onRestore: () => windowManager.restoreWindow(win.id),
                    onFocus: () => windowManager.focusWindow(win.id),
                };

                if (win.id === 'settings') return (
                    <Window {...commonProps} title="Налаштування" minSize={{ width: 600, height: 400 }}>
                        <Settings onClose={() => windowManager.closeWindow('settings')} />
                    </Window>
                );
                if (win.id === 'chat') return (
                    <Window {...commonProps} title="AI Chat" minSize={{ width: 300, height: 400 }}>
                        <Chat
                            onClose={() => windowManager.closeWindow('chat')}
                            onAgentCommand={handleAgentCommand}
                            selectedObjectId={sceneManager.selectedObjectId}
                            objects={sceneManager.objects}
                        />
                    </Window>
                );
                if (win.id === 'instructions') return (
                    <Window {...commonProps} title="Інструкція" minSize={{ width: 600, height: 400 }}>
                        <Instructions onClose={() => windowManager.closeWindow('instructions')} />
                    </Window>
                );
                return null;
            })}
        </Box>
    );
};

export default Editor;
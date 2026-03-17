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
    FullscreenExit,
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

    // 2. Створення пунктів меню (Використовуємо ваші поля sceneManager)
    const menuItems = React.useMemo(() => createContextMenuItems(
        windowManager.openWindow,
        sceneManager,
        !!sceneManager.clipboard, // Ваше оригінальне поле
        sceneManager.clipboard?.type, // Додаткові параметри для конфігу
        sceneManager.clipboard?.subType,
        {
            copy: sceneManager.copyToClipboard,
            paste: sceneManager.pasteFromClipboard,
            duplicate: sceneManager.duplicateObject
        }
    ), [
        windowManager.openWindow, 
        sceneManager.clipboard, // Важливо для оновлення меню
        sceneManager.selectedObjectId, 
        sceneManager
    ]);

    React.useEffect(() => {
        setIsMounted(true);
        if (isMobile) {
            document.documentElement.classList.add('mobile-fullscreen');
        }
    }, [isMobile]);

    // ВИПРАВЛЕНО: Приведення типу для уникнення помилки ObjectTreeNode
    React.useEffect(() => {
        const treeData = sceneManager.getTreeScene() as any;
        sceneTree.updateTree(treeData);
    }, [sceneManager.objects, sceneTree, sceneManager]);

    // Гарячі клавіші
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        if (sceneManager.selectedObjectId) sceneManager.copyToClipboard(sceneManager.selectedObjectId);
                        break;
                    case 'v':
                        sceneManager.pasteFromClipboard(sceneManager.selectedObjectId || undefined);
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

    const handleSettingsClick = React.useCallback(() => {
        windowManager.openWindow('settings', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 100, y: 100 },
            size: isMobile ? { width: window.innerWidth, height: window.innerHeight } : { width: 600, height: 400 },
        });
    }, [windowManager, isMobile]);

    const handleInstructionsClick = React.useCallback(() => {
        windowManager.openWindow('instructions', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 150, y: 150 },
            size: isMobile ? { width: window.innerWidth, height: window.innerHeight } : { width: 800, height: 600 },
        });
    }, [windowManager, isMobile]);

    const handleChatClick = React.useCallback(() => {
        windowManager.openWindow('chat', {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: 150, y: 150 },
            size: isMobile ? { width: window.innerWidth, height: window.innerHeight } : { width: 400, height: 600 },
        });
    }, [windowManager, isMobile]);

    if (!isMounted) return null;

    return (
        <Box
            sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                bgcolor: 'background.default', overflow: 'hidden',
                ...(isMobile && { width: '100vw', height: '100vh' }),
            }}
            onContextMenu={contextMenu.showContextMenu}
        >
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ color: 'text.primary', mr: 2 }}>3D Editor</Typography>

                    <Button color="inherit" startIcon={<FolderIcon />} onClick={handleFileMenuOpen} sx={{ color: 'text.primary', mr: 1 }}>Файл</Button>
                    <Button color="inherit" startIcon={<CategoryIcon />} onClick={(e) => setObjectMenuAnchor(e.currentTarget)} sx={{ color: 'text.primary', mr: 1 }}>Об'єкт</Button>
                    
                    <ObjectSelectorMenu
                        anchorEl={objectMenuAnchor}
                        open={Boolean(objectMenuAnchor)}
                        onClose={() => setObjectMenuAnchor(null)}
                        onSelect={handleObjectSelect}
                    />
                    
                    <Button color="inherit" startIcon={<HelpIcon />} onClick={handleInstructionsClick} sx={{ color: 'text.primary', mr: 1 }}>Інструкція</Button>

                    <Menu anchorEl={fileMenuAnchor} open={Boolean(fileMenuAnchor)} onClose={handleFileMenuClose}>
                        <MenuItem onClick={() => handleFileMenuClick('import')}>Імпорт моделі</MenuItem>
                        <MenuItem onClick={() => handleFileMenuClick('export')}>Експорт моделі</MenuItem>
                        <MenuItem onClick={handleSaveProject}>Зберегти</MenuItem>
                        <MenuItem onClick={() => setWorkshopDialogOpen(true)}>Майстерня</MenuItem>
                    </Menu>

                    <Box sx={{ flexGrow: 1 }} />

                    {isMobile && isSupported && (
                        <Tooltip title={isFullscreen ? 'Вийти' : 'Повний екран'}>
                            <IconButton onClick={toggleFullscreen} sx={{ color: 'text.primary', mr: 1 }}>
                                {isFullscreen ? <FullscreenExit /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button color="inherit" startIcon={<SettingsIcon />} onClick={handleSettingsClick} sx={{ color: 'text.primary', mr: 1 }}>Налаштування</Button>
                    <Button color="inherit" startIcon={<AIIcon />} onClick={handleChatClick} sx={{ color: 'text.primary' }}>AI</Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <LeftMenu
                    isEditMode={sceneManager.isEditMode}
                    selectedObjectId={sceneManager.selectedObjectId}
                    onAddObject={() => setObjectSelectorDialogOpen(true)}
                    onToggleEditMode={sceneManager.toggleEditMode}
                    onSetTransformMode={sceneManager.setTransformMode}
                    onRemoveObject={sceneManager.removeObject}
                    onColorChange={handleColorChange}
                />

                <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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

                <Box sx={{ width: isRightMenuVisible ? (isMobile ? '40%' : 300) : 0, transition: 'width 0.3s' }}>
                    <RightMenu
                        treeData={sceneTree.treeData}
                        onUpdateTree={sceneTree.updateTree}
                        selectedObjectId={sceneManager.selectedObjectId}
                        objects={sceneManager.objects}
                        onSelectObject={sceneManager.selectObject}
                        onUpdateObject={handleUpdateObject}
                    />
                </Box>
            </Box>

            <ContextMenu
                isVisible={contextMenu.isVisible}
                position={contextMenu.position}
                items={menuItems}
                onClose={contextMenu.hideContextMenu}
            />

            <FileDialog open={fileDialogOpen} operation={fileOperation} onClose={handleFileDialogClose} onConfirm={handleFileConfirm} objectsCount={sceneManager.objects.length} />
            <WorkshopDialog open={workshopDialogOpen} onClose={() => setWorkshopDialogOpen(false)} onLoadProject={handleLoadProject} />
            <ObjectSelectorDialog open={objectSelectorDialogOpen} onClose={() => setObjectSelectorDialogOpen(false)} onSelect={handleObjectSelect} />

            {windowManager.windows.map(win => (
                <Window key={win.id} {...win} title={win.id === 'chat' ? 'AI Chat' : win.id === 'settings' ? 'Налаштування' : 'Інструкція'}
                    onClose={() => windowManager.closeWindow(win.id)} onMinimize={() => windowManager.minimizeWindow(win.id)}
                    onMaximize={() => windowManager.maximizeWindow(win.id)} onRestore={() => windowManager.restoreWindow(win.id)}
                    onFocus={() => windowManager.focusWindow(win.id)}
                >
                    {win.id === 'settings' && <Settings onClose={() => windowManager.closeWindow('settings')} />}
                    {win.id === 'chat' && <Chat onClose={() => windowManager.closeWindow('chat')} onAgentCommand={handleAgentCommand} selectedObjectId={sceneManager.selectedObjectId} objects={sceneManager.objects} />}
                    {win.id === 'instructions' && <Instructions onClose={() => windowManager.closeWindow('instructions')} />}
                </Window>
            ))}
        </Box>
    );
};

export default Editor;
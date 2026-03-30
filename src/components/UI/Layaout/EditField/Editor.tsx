'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

// Components
import { Workplace } from './Workplace';
import { TopBar } from './TopBar'; 
import { ContextMenu } from '@/components/ContextMenu/ContextMenu';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Layaout/Settings/SettingsLayout';
import { Chat } from '@/components/UI/Layaout/Chat/ChatLayout';
import { Instructions } from '@/components/UI/Layaout/Instructions/InstructionsLayout';
import { FileDialog } from '../FileMenu/FileDialog';
import { WorkshopDialog } from '../FileMenu/WorkshopDialog';
import { ObjectSelectorDialog } from '../ObjectSelector/ObjectSelectorDialog';
import { Timer } from '@/components/UI/Layaout/Timer/Timer';

// Hooks
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/Scene/useSceneManager';
import { useSettings } from '@/hooks/useSettings';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useFullscreen } from '@/hooks/useFullscreen';
import useSceneTree from '@/hooks/Scene/useSceneTree';
import { useFileOperations } from '../../../../hooks/Scene/useFileOperations';
import { useObjectUpdate } from '../../../../hooks/Scene/useObjectUpdate';
import { useAgentCommands } from '../../../../hooks/Agent/useAgentCommands';
import { useTimer } from '@/hooks/useTimer';

// Config
import { createContextMenuItems } from '@/config/contextMenuConfig';
import { WINDOW_CONFIG } from '@/config/editorConfig';

const Editor: React.FC = () => {
    const isMobile = useIsMobile();
    const { settings } = useSettings();    
    const timer = useTimer();

    const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();

    const [isMounted, setIsMounted] = useState(false);
    const [showRightMenu, setShowRightMenu] = useState(true);
    const [objectSelectorDialogOpen, setObjectSelectorDialogOpen] = useState(false);

    const {
        fileMenuAnchor, fileDialogOpen, fileOperation, workshopDialogOpen, setWorkshopDialogOpen,
        handleFileMenuOpen, handleFileMenuClose, handleFileMenuClick,
        handleFileDialogClose, handleFileConfirm, handleSaveProject, handleLoadProject,
    } = useFileOperations(sceneManager);

    const { handleColorChange, handleUpdateObject, handleObjectSelect } = useObjectUpdate(sceneManager);
    const { handleAgentCommand } = useAgentCommands(sceneManager, handleUpdateObject);

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

    useEffect(() => {
        setIsMounted(true);
        if (isMobile) {
            document.documentElement.classList.add('mobile-fullscreen');
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMounted) {
            sceneTree.updateTree(sceneManager.getTreeScene() as any);
        }
    }, [sceneManager.objects, sceneManager, sceneTree, isMounted]);

    const handleOpenWindow = useCallback((id: keyof typeof WINDOW_CONFIG) => {
        const config = WINDOW_CONFIG[id];
        windowManager.openWindow(id, {
            isVisible: true,
            position: isMobile ? { x: 0, y: 0 } : { x: config.defaultX, y: config.defaultY },
            size: isMobile ? { 
                width: window.innerWidth, 
                height: window.innerHeight - 48
            } : { 
                width: config.width, 
                height: config.height 
            },
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
                position: 'fixed', 
                inset: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: 'background.default', 
                overflow: 'hidden' 
            }} 
            onContextMenu={handleOnContextMenu}
        >
            <TopBar 
                isMobile={isMobile}
                showRightMenu={showRightMenu}
                setShowRightMenu={setShowRightMenu}
                isFullscreen={!!isFullscreen}
                isSupported={!!isSupported}
                toggleFullscreen={typeof toggleFullscreen === 'function' ? toggleFullscreen : () => {}}
                handleOpenWindow={handleOpenWindow}
                fileMenuAnchor={fileMenuAnchor}
                handleFileMenuOpen={handleFileMenuOpen}
                handleFileMenuClose={handleFileMenuClose}
                handleFileMenuClick={handleFileMenuClick}
                handleSaveProject={handleSaveProject}
                setWorkshopDialogOpen={setWorkshopDialogOpen}
                handleObjectSelect={handleObjectSelect}
                isTimerRunning={timer.isActive} 
            />

            <Workplace
                isMobile={isMobile}
                showRightMenu={showRightMenu}
                sceneManager={sceneManager}
                sceneTree={sceneTree}
                settings={settings}
                handleColorChange={handleColorChange}
                handleUpdateObject={handleUpdateObject}
                setObjectSelectorDialogOpen={setObjectSelectorDialogOpen}
            />

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

            {windowManager.windows.map(win => (
                <Window 
                    key={win.id} 
                    {...win} 
                    title={WINDOW_CONFIG[win.id as keyof typeof WINDOW_CONFIG]?.title || 'Вікно'} 
                    onClose={() => windowManager.closeWindow(win.id)}
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
                    
                    {win.id === 'timer' && (
                        <Timer externalState={timer} />
                    )}
                </Window>
            ))}
        </Box>
    );
};

export default Editor;
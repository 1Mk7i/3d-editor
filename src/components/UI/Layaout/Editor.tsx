'use client';

import React from 'react';
import ThreeScene from '@/components/UI/Scene/ThreeScene';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/useSceneManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import * as THREE from 'three';
import { Menu } from '@/components/UI/Menu/Menu';
import useSceneTree from '@/hooks/useSceneTree';
import { Button } from '@/components/UI/Button/Button';
import { Window } from '@/components/Modals/Window/Window';
import { Settings } from '@/components/UI/Settings/SettingsLayout';
import { LeftMenu } from './LeftMenu';
import { RightMenu } from './RightMenu';

const Editor: React.FC = () => {
    const contextMenu = useContextMenu();
    const windowManager = useWindowManager();
    const sceneManager = useSceneManager();
    const sceneTree = useSceneTree();

    React.useEffect(() => {
        const tree = sceneManager.getTreeScene();
        if (JSON.stringify(tree) !== JSON.stringify(sceneTree.treeData)) {
            sceneTree.updateTree(tree);
        }
    }, [sceneManager.objects, sceneManager.getTreeScene, sceneTree]);

    const handleSettingsClick = React.useCallback(() => {
        windowManager.openWindow('settings', {
            isVisible: true,
            position: { x: 100, y: 100 },
            size: { width: 600, height: 400 }
        });
    }, [windowManager]);

    const handleColorChange = React.useCallback(() => {
        if (sceneManager.selectedObjectId) {
            const selectedObject = sceneManager.objects.find(obj => obj.id === sceneManager.selectedObjectId);
            if (selectedObject) {
                const mesh = selectedObject.mesh as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material) {
                    const randomColor = Math.random() * 0xffffff;
                    material.color.setHex(randomColor);
                }
            }
        }
    }, [sceneManager]);

    return (
        <div 
            className="relative w-screen h-screen"
            onContextMenu={contextMenu.showContextMenu}
        >
            <Menu 
                variant='primary'
                title="3D Editor"
                position='top'
                size='large'
                elevation={2}
            >    
                <Button variant="menu" size='small' onClick={handleSettingsClick}>
                    Налаштування
                </Button>
            </Menu>

            <div className="flex flex-1">
                <LeftMenu 
                    isEditMode={sceneManager.isEditMode}
                    selectedObjectId={sceneManager.selectedObjectId}
                    onAddObject={sceneManager.addObject}
                    onToggleEditMode={sceneManager.toggleEditMode}
                    onSetTransformMode={sceneManager.setTransformMode}
                    onRemoveObject={sceneManager.removeObject}
                    onColorChange={handleColorChange}
                />

                <div className="flex-1 relative">
                    <ThreeScene
                        objects={sceneManager.objects}
                        selectObject={sceneManager.selectObject}
                        selectedObjectId={sceneManager.selectedObjectId}
                        clearSelection={sceneManager.clearSelection}
                        isEditMode={sceneManager.isEditMode}
                        transformMode={sceneManager.transformMode}
                    />
                </div>

                <RightMenu 
                    treeData={sceneTree.treeData}
                    onUpdateTree={sceneTree.updateTree}
                />
            </div>

            <ContextMenu
                isVisible={contextMenu.isVisible}
                position={contextMenu.position}
                items={createContextMenuItems(windowManager.openWindow, sceneManager)}
                onClose={contextMenu.hideContextMenu}
            />

            {windowManager.windows.map(window => {
                if (window.id === 'settings') {
                    return (
                        <Window
                            key={window.id}
                            id={window.id}
                            title="Налаштування"
                            isVisible={window.isVisible}
                            isMinimized={window.isMinimized}
                            isMaximized={window.isMaximized}
                            initialPosition={window.position}
                            initialSize={window.size}
                            minSize={{ width: 600, height: 400 }}
                            resizable={true}
                            draggable={true}
                            zIndex={window.zIndex}
                            onClose={() => windowManager.closeWindow(window.id)}
                            onMinimize={() => windowManager.minimizeWindow(window.id)}
                            onMaximize={() => windowManager.maximizeWindow(window.id)}
                            onRestore={() => windowManager.restoreWindow(window.id)}
                            onFocus={() => windowManager.focusWindow(window.id)}
                        >
                            <Settings onClose={() => windowManager.closeWindow('settings')} />
                        </Window>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default Editor;

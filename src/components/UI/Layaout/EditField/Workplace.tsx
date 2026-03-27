'use client';

import React from 'react';
import { Box, useTheme, Drawer } from '@mui/material';
import { LeftMenu } from '../LeftMenu';
import { RightMenu } from '../RightMenu';
import ThreeScene from '@/components/UI/Scene/ThreeScene';
import { UI_DIMENSIONS } from '@/config/editorConfig';

interface WorkplaceProps {
    isMobile: boolean;
    showRightMenu: boolean;
    sceneManager: any; 
    sceneTree: any;
    settings: any;
    handleColorChange: (color: string) => void;
    handleUpdateObject: (id: string, updates: any) => void;
    setObjectSelectorDialogOpen: (open: boolean) => void;
}

export const Workplace: React.FC<WorkplaceProps> = ({
    isMobile,
    showRightMenu,
    sceneManager,
    sceneTree,
    settings,
    handleColorChange,
    handleUpdateObject,
    setObjectSelectorDialogOpen,
}) => {
    const theme = useTheme();

    const renderRightMenu = () => (
        <RightMenu
            treeData={sceneTree.treeData}
            onUpdateTree={sceneTree.updateTree}
            selectedObjectId={sceneManager.selectedObjectId}
            objects={sceneManager.objects}
            onSelectObject={sceneManager.selectObject}
            onUpdateObject={handleUpdateObject}
        />
    );

    return (
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
                bgcolor: theme.palette.editor?.sceneBackground || '#1a1a1a'
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

            {!isMobile && showRightMenu && (
                <Box sx={{ 
                    width: UI_DIMENSIONS.RIGHT_MENU_WIDTH, 
                    borderLeft: 1, 
                    borderColor: 'divider', 
                    bgcolor: 'background.paper',
                    animation: 'slideIn 0.2s ease-out',
                    '@keyframes slideIn': {
                        from: { opacity: 0, transform: 'translateX(20px)' },
                        to: { opacity: 1, transform: 'translateX(0)' }
                    }
                }}>
                    {renderRightMenu()}
                </Box>
            )}

            {isMobile && (
                <Box sx={{
                    position: 'fixed',
                    right: 0,
                    top: 48,
                    bottom: 0,
                    width: '280px',
                    zIndex: 1300,
                    bgcolor: 'background.paper',
                    borderLeft: 1,
                    borderColor: 'divider',
                    boxShadow: '-4px 0 10px rgba(0,0,0,0.1)',
                    transform: showRightMenu ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {renderRightMenu()}
                </Box>
            )}
        </Box>
    );
};
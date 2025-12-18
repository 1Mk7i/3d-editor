'use client';

import React from 'react';
import SceneTree from '@/components/UI/Menu/SceneTree';
import { ObjectProperties } from './ObjectProperties';
import {
  Paper,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import * as THREE from 'three';

interface RightMenuProps {
    treeData: any;
    onUpdateTree: (data: any) => void;
    selectedObjectId: string | null;
    objects: any[];
    onSelectObject?: (id: string) => void;
    onUpdateObject: (id: string, updates: {
        name?: string;
        position?: { x: number; y: number; z: number };
        rotation?: { x: number; y: number; z: number };
        color?: number;
        materialType?: 'standard' | 'wireframe' | 'points';
    }) => void;
}

export const RightMenu: React.FC<RightMenuProps> = ({
    treeData,
    onUpdateTree,
    selectedObjectId,
    objects,
    onSelectObject,
    onUpdateObject,
}) => {
    const selectedObject = selectedObjectId
        ? objects.find(obj => obj.id === selectedObjectId)?.mesh || null
        : null;

    const handleUpdateObject = (updates: {
        name?: string;
        position?: { x: number; y: number; z: number };
        rotation?: { x: number; y: number; z: number };
        color?: number;
        materialType?: 'standard' | 'wireframe' | 'points';
    }) => {
        if (selectedObjectId) {
            onUpdateObject(selectedObjectId, updates);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: 300,
                minWidth: 200,
                maxWidth: 400,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderLeft: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                flexShrink: 0,
            }}
        >
            {/* Верхня частина - Дерево сцени */}
            <Box sx={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        Scene Tree
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <SceneTree 
                        treeData={treeData} 
                        updateTree={onUpdateTree}
                        selectedObjectId={selectedObjectId}
                        onSelectObject={onSelectObject}
                    />
                </Box>
            </Box>

            <Divider />

            {/* Нижня частина - Параметри об'єкта */}
            <Box sx={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <ObjectProperties
                        selectedObject={selectedObject}
                        onUpdateObject={handleUpdateObject}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

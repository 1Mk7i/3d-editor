'use client';

import React, { useCallback } from 'react';
import * as THREE from 'three';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenWith as MoveIcon,
  RotateRight as RotateIcon,
  AspectRatio as ScaleIcon,
} from '@mui/icons-material';

interface LeftMenuProps {
    isEditMode: boolean;
    selectedObjectId: string | null;
    onAddObject: () => void; // Тепер просто callback для відкриття діалогу
    onToggleEditMode: () => void;
    onSetTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
    onRemoveObject: (id: string) => void;
    onColorChange: () => void;
}


const TransformControls = ({ onSetTransformMode }: { onSetTransformMode: LeftMenuProps['onSetTransformMode'] }) => {
    const handleTranslate = useCallback(() => {
        onSetTransformMode('translate');
    }, [onSetTransformMode]);

    const handleRotate = useCallback(() => {
        onSetTransformMode('rotate');
    }, [onSetTransformMode]);

    const handleScale = useCallback(() => {
        onSetTransformMode('scale');
    }, [onSetTransformMode]);

    return (
        <>
            <Tooltip title="Переміщення">
                <IconButton
                    onClick={handleTranslate}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                        '&:active': { transform: 'scale(0.95)' },
                    }}
                >
                    <MoveIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Обертання">
                <IconButton
                    onClick={handleRotate}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                        '&:active': { transform: 'scale(0.95)' },
                    }}
                >
                    <RotateIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Масштабування">
                <IconButton
                    onClick={handleScale}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                        '&:active': { transform: 'scale(0.95)' },
                    }}
                >
                    <ScaleIcon fontSize="large" />
                </IconButton>
            </Tooltip>
        </>
    );
};

export const LeftMenu: React.FC<LeftMenuProps> = ({
    isEditMode,
    selectedObjectId,
    onAddObject,
    onToggleEditMode,
    onSetTransformMode,
    onRemoveObject,
    onColorChange
}) => {
    const handleAddObject = useCallback(() => {
        onAddObject(); // Відкриваємо діалог вибору об'єкта
    }, [onAddObject]);

    const handleRemoveObject = useCallback(() => {
        if (selectedObjectId) {
            onRemoveObject(selectedObjectId);
        }
    }, [selectedObjectId, onRemoveObject]);

    return (
        <Paper
            elevation={0}
            sx={{
                width: 80,
                minWidth: 80,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                borderRadius: 0,
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                flexShrink: 0,
            }}
        >
            <Tooltip title="Додати об'єкт" placement="right">
                <IconButton
                    onClick={handleAddObject}
                    color="primary"
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&:active': { transform: 'scale(0.95)' },
                    }}
                >
                    <AddIcon fontSize="large" />
                </IconButton>
            </Tooltip>

            <Divider sx={{ width: '100%' }} />

            {selectedObjectId && (
                <>
                    <Tooltip title={isEditMode ? "Вийти з режиму редагування" : "Режим редагування"} placement="right">
                        <IconButton
                            onClick={onToggleEditMode}
                            color={isEditMode ? 'success' : 'default'}
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: isEditMode ? 'success.main' : 'background.default',
                                color: isEditMode ? 'success.contrastText' : 'text.primary',
                                '&:hover': {
                                    bgcolor: isEditMode ? 'success.dark' : 'action.hover',
                                },
                                '&:active': { transform: 'scale(0.95)' },
                            }}
                        >
                            <EditIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>

                    {isEditMode && (
                        <>
                            <Divider sx={{ width: '100%' }} />
                            <TransformControls onSetTransformMode={onSetTransformMode} />
                        </>
                    )}
                </>
            )}

            <Divider sx={{ width: '100%', mt: 'auto' }} />

            <Tooltip title="Видалити об'єкт" placement="right">
                <IconButton
                    onClick={handleRemoveObject}
                    disabled={!selectedObjectId}
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'error.main',
                        color: 'error.contrastText',
                        '&:hover': { bgcolor: 'error.dark' },
                        '&:disabled': {
                            bgcolor: 'action.disabledBackground',
                            color: 'action.disabled',
                        },
                        '&:active': { transform: 'scale(0.95)' },
                    }}
                >
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </Tooltip>
        </Paper>
    );
};

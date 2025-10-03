'use client';

import React from 'react';
import { Menu } from '@/components/UI/Menu/Menu';
import { Button } from '@/components/UI/Button/Button';
import * as THREE from 'three';

interface LeftMenuProps {
    isEditMode: boolean;
    selectedObjectId: string | null;
    onAddObject: (mesh: THREE.Mesh) => void;
    onToggleEditMode: () => void;
    onSetTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
    onRemoveObject: (id: string) => void;
    onColorChange: () => void;
}

const createNewMesh = () => {
    return new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 'red' })
    );
};

const TransformControls = ({ onSetTransformMode }: { onSetTransformMode: LeftMenuProps['onSetTransformMode'] }) => {
    return (
        <>
            <Button
                variant="secondary"
                onClick={() => onSetTransformMode('translate')}
            >
                Move
            </Button>
            <Button
                variant="secondary"
                onClick={() => onSetTransformMode('rotate')}
            >
                Rotate
            </Button>
            <Button
                variant="secondary"
                onClick={() => onSetTransformMode('scale')}
            >
                Scale
            </Button>
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
    return (
        <Menu
            position='left'
            variant='secondary'
            elevation={0}
            title="Left Menu"
            orientation='vertical'
        >

            <Button onClick={() => onAddObject(createNewMesh())}>
                Create
            </Button>
            <Button
                onClick={onToggleEditMode}
                variant={isEditMode ? 'success' : 'primary'}
            >
                {isEditMode ? 'Exit Edit' : 'Edit'}
            </Button>

            {isEditMode && <TransformControls onSetTransformMode={onSetTransformMode} />}

            <Button
                variant="danger"
                onClick={() => {
                    if (selectedObjectId) {
                        onRemoveObject(selectedObjectId);
                    }
                }}
            >
                Delete
            </Button>

            <Button
                onClick={onColorChange}
                variant="secondary"
            >
                Change Random Color
            </Button>

        </Menu>
    );
};
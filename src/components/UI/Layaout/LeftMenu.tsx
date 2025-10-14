'use client';

import React from 'react';
import { Menu } from '@/components/UI/Menu/Menu';
import { Button } from '@/components/UI/Button/Button';
import * as THREE from 'three';

// Створіть компоненти іконок або використовуйте напряму
const MoveIcon = () => <img src="/assets/move.svg" alt="Move" width={20} height={20} />
const RotateIcon = () => <img src="/assets/rotate.svg" alt="Rotate" width={20} height={20} />
const ScaleIcon = () => <img src="/assets/scale.svg" alt="Scale" width={20} height={20} />
const CreateIcon = () => <img src="/assets/create.svg" alt="Create" width={20} height={20} />
const EditIcon = () => <img src="/assets/edit.svg" alt="Edit" width={20} height={20} />
const DeleteIcon = () => <img src="/assets/delete.svg" alt="Delete" width={20} height={20} />

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
                icon={<MoveIcon />}
                onClick={() => onSetTransformMode('translate')}
                size='extraLarge'
            />
            <Button
                variant="secondary"
                icon={<RotateIcon />}
                onClick={() => onSetTransformMode('rotate')}
                size='extraLarge'
            />
            <Button
                variant="secondary"
                icon={<ScaleIcon />}
                onClick={() => onSetTransformMode('scale')}
                size='extraLarge'
            />
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
            variant='invisible'
            elevation={0}
            title="Left Menu"
            orientation='vertical'
        >

            <Button 
                onClick={() => onAddObject(createNewMesh())}
                icon={<CreateIcon />}
                size='extraLarge'
            />
            <Button
                onClick={onToggleEditMode}
                icon={<EditIcon />}
                size='extraLarge'
                variant={isEditMode ? 'success' : 'primary'}
            />

            {isEditMode && <TransformControls onSetTransformMode={onSetTransformMode} />}

            <Button
                variant="danger"
                icon={<DeleteIcon />}
                size='extraLarge'
                onClick={() => {
                    if (selectedObjectId) {
                        onRemoveObject(selectedObjectId);
                    }
                }}
            />
            {/* <Button
                onClick={onColorChange}
                variant="secondary"
                size='extraLarge'
            >
                Change Random Color
            </Button> */}

        </Menu>
    );
};
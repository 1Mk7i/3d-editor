'use client';

import React from 'react';
import * as THREE from 'three';
import { useSceneManager } from '@/hooks/Scene/useSceneManager';
import { AgentCommand } from '@/shared/prompts/agentPrompt';
import { createThreeObject, THREE_OBJECT_TYPES } from '@/shared/constants/threeObjects';

type HandleUpdateObject = (id: string, updates: {
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    color?: number;
    materialType?: 'standard' | 'wireframe' | 'points';
}) => void;

/** Знаходить objectId за ID або за назвою */
function resolveObjectId(
    command: AgentCommand,
    sceneManager: ReturnType<typeof useSceneManager>
): string | null {
    if (!command.objectId) return null;
    if (command.objectId === 'selected') return sceneManager.selectedObjectId;

    const byId = sceneManager.objects.find(obj => obj.id === command.objectId);
    if (byId) return byId.id;

    const byName = sceneManager.objects.find(obj => obj.name === command.objectId);
    if (byName) {
        console.log(`Знайдено об'єкт "${command.objectId}" за назвою, ID: ${byName.id}`);
        return byName.id;
    }
    return null;
}

export function useAgentCommands(
    sceneManager: ReturnType<typeof useSceneManager>,
    handleUpdateObject: HandleUpdateObject
) {
    const handleAgentCommand = React.useCallback((command: AgentCommand) => {
        try {
            if (command.action === 'create' && command.objectType) {
                const objectType = THREE_OBJECT_TYPES.find(obj => obj.id === command.objectType);
                if (!objectType) return;

                const mesh = createThreeObject(objectType);

                if (command.position) mesh.position.set(command.position.x, command.position.y, command.position.z);
                if (command.rotation) mesh.rotation.set(command.rotation.x, command.rotation.y, command.rotation.z);
                if (command.scale) mesh.scale.set(command.scale.x, command.scale.y, command.scale.z);

                if (command.color) {
                    const material = mesh.material as THREE.MeshStandardMaterial;
                    material.color.setHex(parseInt(command.color.replace('#', ''), 16));
                }
                if (command.materialType) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    if (command.materialType === 'wireframe') {
                        mat.wireframe = true;
                    } else if (command.materialType === 'points') {
                        mesh.material = new THREE.PointsMaterial({ color: mat.color.getHex(), size: 0.1 });
                    }
                }

                sceneManager.addObject(mesh, command.name || objectType.name, mesh.type);

            } else if (command.action === 'delete') {
                const objectId = resolveObjectId(command, sceneManager);
                if (objectId) {
                    sceneManager.removeObject(objectId);
                    console.log(`Об'єкт "${objectId}" видалено`);
                } else {
                    console.warn(`Не знайдено об'єкт для видалення: "${command.objectId}"`);
                }

            } else if (command.action === 'update') {
                const objectId = resolveObjectId(command, sceneManager);
                if (objectId) {
                    const updates: Parameters<HandleUpdateObject>[1] = {};
                    if (command.name) updates.name = command.name;
                    if (command.position) updates.position = command.position;
                    if (command.rotation) updates.rotation = command.rotation;
                    if (command.scale) updates.scale = command.scale;
                    if (command.color) updates.color = parseInt(command.color.replace('#', ''), 16);
                    if (command.materialType) updates.materialType = command.materialType;
                    handleUpdateObject(objectId, updates);
                }

            } else if (command.action === 'select') {
                const objectId = resolveObjectId(command, sceneManager);
                if (objectId) {
                    sceneManager.selectObject(objectId);
                } else {
                    console.warn(`Не знайдено об'єкт для виділення: "${command.objectId}"`);
                }

            } else if (command.action === 'clear') {
                sceneManager.clearSelection();
            }
        } catch (error) {
            console.error('Помилка при виконанні команди агента:', error);
        }
    }, [sceneManager, handleUpdateObject]);

    return { handleAgentCommand };
}

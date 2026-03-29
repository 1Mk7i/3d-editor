'use client';

import React from 'react';
import * as THREE from 'three';
import { useSceneManager } from '@/hooks/useSceneManager';
import { ThreeObjectType, createThreeObject } from '@/shared/constants/threeObjects';

type ObjectUpdate = {
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    color?: number;
    materialType?: 'standard' | 'wireframe' | 'points';
};

export function useObjectUpdate(sceneManager: ReturnType<typeof useSceneManager>) {
    const handleColorChange = React.useCallback(() => {
        if (sceneManager.selectedObjectId) {
            const selectedObject = sceneManager.objects.find(
                obj => obj.id === sceneManager.selectedObjectId
            );
            if (selectedObject) {
                const mesh = selectedObject.mesh as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;
                if (material) {
                    material.color.setHex(Math.random() * 0xffffff);
                }
            }
        }
    }, [sceneManager]);

    const handleUpdateObject = React.useCallback((id: string, updates: ObjectUpdate) => {
        const object = sceneManager.objects.find(obj => obj.id === id);
        if (!object) return;

        const mesh = object.mesh; 

        if (updates.name !== undefined) {
            sceneManager.updateObject(id, { name: updates.name });
        }

        if (updates.position) {
            mesh.position.set(updates.position.x, updates.position.y, updates.position.z);
            sceneManager.updateObject(id, { position: updates.position });
        }

        if (updates.rotation) {
            mesh.rotation.set(updates.rotation.x, updates.rotation.y, updates.rotation.z);
            sceneManager.updateObject(id, { rotation: updates.rotation });
        }

        if (updates.scale) {
            mesh.scale.set(updates.scale.x, updates.scale.y, updates.scale.z);
        }

        if (updates.color !== undefined) {
            const material = (mesh as THREE.Mesh).material as any;
            if (material && material.color) {
                material.color.setHex(updates.color);
            }
        }

        if (updates.materialType) {
            const m = mesh as THREE.Mesh;
            if (updates.materialType === 'wireframe') {
                (m.material as any).wireframe = true;
            } else if (updates.materialType === 'standard') {
                (m.material as any).wireframe = false;
                if (m.material instanceof THREE.PointsMaterial) {
                    m.material = new THREE.MeshStandardMaterial({ color: m.material.color.getHex() });
                }
            } else if (updates.materialType === 'points') {
                if (!(m.material instanceof THREE.PointsMaterial)) {
                    const oldColor = (m.material as any).color?.getHex() || 0xffffff;
                    m.material = new THREE.PointsMaterial({ color: oldColor, size: 0.1 });
                }
            }
        }
    }, [sceneManager]);

    const handleObjectSelect = React.useCallback((objectType: ThreeObjectType) => {
        const mesh = createThreeObject(objectType);
        sceneManager.addObject(mesh, objectType.name, mesh.type);
    }, [sceneManager]);

    return { handleColorChange, handleUpdateObject, handleObjectSelect };
}

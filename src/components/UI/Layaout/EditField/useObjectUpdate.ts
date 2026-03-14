'use client';

import React from 'react';
import * as THREE from 'three';
import { useSceneManager } from '@/hooks/useSceneManager';
import { ThreeObjectType, createThreeObject } from '@/shared/constants/threeObjects';
import { FileFormat } from '../FileMenu/FileDialog';
import {
    importFromJSON,
    createObjectFromData,
    loadFileAsText,
    importModelFromFile,
    exportSceneToFormat,
} from '@/shared/services/fileService';
import { saveProject } from '@/shared/services/projectService';

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

        const mesh = object.mesh as THREE.Mesh;

        if (updates.name !== undefined || updates.position || updates.rotation) {
            sceneManager.updateObject(id, {
                name: updates.name,
                position: updates.position,
                rotation: updates.rotation,
            });
        }

        if (updates.scale) {
            mesh.scale.set(updates.scale.x, updates.scale.y, updates.scale.z);
        }

        if (updates.color !== undefined) {
            const material = mesh.material as THREE.MeshStandardMaterial | THREE.PointsMaterial;
            if (material && 'color' in material) {
                material.color.setHex(updates.color);
            }
        }

        if (updates.materialType) {
            const currentMaterial = mesh.material as THREE.MeshStandardMaterial;
            if (currentMaterial) {
                if (updates.materialType === 'wireframe') {
                    currentMaterial.wireframe = true;
                } else if (updates.materialType === 'points') {
                    if (!(currentMaterial instanceof THREE.PointsMaterial)) {
                        mesh.material = new THREE.PointsMaterial({
                            color: currentMaterial.color.getHex(),
                            size: 0.1,
                        });
                    }
                } else {
                    if (mesh.material instanceof THREE.PointsMaterial) {
                        mesh.material = new THREE.MeshStandardMaterial({
                            color: mesh.material.color.getHex(),
                        });
                    } else {
                        currentMaterial.wireframe = false;
                    }
                }
            }
        }
    }, [sceneManager.objects]);

    const handleObjectSelect = React.useCallback((objectType: ThreeObjectType) => {
        const mesh = createThreeObject(objectType);
        sceneManager.addObject(mesh, objectType.name, mesh.type);
    }, [sceneManager]);

    return { handleColorChange, handleUpdateObject, handleObjectSelect };
}

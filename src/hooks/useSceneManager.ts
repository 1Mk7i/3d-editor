'use client';

import { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { CollectionElementProps } from '@/components/UI/Collection/types';
import { logger } from '@/shared/utils/logger';

export function useSceneManager() {
  const [objects, setObjects] = useState<CollectionElementProps[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  
  // Буфер обміну для об'єктів
  const [clipboard, setClipboard] = useState<THREE.Object3D | null>(null);

  /**
   * Допоміжна функція для підготовки клонованого об'єкта.
   * Важливо: Three.js копіює UUID при .clone(), тому його треба міняти вручну.
   */
  const prepareClonedMesh = (mesh: THREE.Object3D) => {
    mesh.uuid = THREE.MathUtils.generateUUID();
    
    // Скидаємо підсвітку (emissive), якщо вона була на оригіналі
    mesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        if ((m.material as THREE.MeshStandardMaterial).emissive) {
          (m.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
        }
      }
    });
    return mesh;
  };

  const addObject = useCallback((mesh: THREE.Object3D, name: string = 'Unnamed Object', type: string = mesh.type) => {
    setObjects(prev => {
      const newObject: CollectionElementProps = {
        id: mesh.uuid,
        mesh: mesh,
        name: name,
        type: type,
        shape: (mesh as THREE.Mesh).geometry ? (mesh as THREE.Mesh).geometry.type : null,
        children: []
      };
      return [...prev, newObject];
    });
  }, []);

  const removeObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }, [selectedObjectId]);

  const selectObject = useCallback((id: string) => {
    setSelectedObjectId(id);
    objects.forEach(o => {
      const mesh = o.mesh as THREE.Mesh;
      const material = mesh?.material as THREE.MeshStandardMaterial;
      if (material?.emissive) {
        material.emissive.setHex(o.id === id ? 0x444400 : 0x000000);
      }
    });
  }, [objects]);

  const clearSelection = useCallback(() => {
    setSelectedObjectId(null);
    objects.forEach(o => {
      const mesh = o.mesh as THREE.Mesh;
      const material = mesh?.material as THREE.MeshStandardMaterial;
      if (material?.emissive) material.emissive.setHex(0x000000);
    });
  }, [objects]);

  // --- Функції Дублювання та Буфера ---

  const duplicateObject = useCallback((id: string) => {
    const source = objects.find(obj => obj.id === id);
    if (source && source.mesh) {
      const clonedMesh = source.mesh.clone();
      prepareClonedMesh(clonedMesh);
      
      // Зсув, щоб копія не перекривала оригінал
      clonedMesh.position.x += 1;
      clonedMesh.position.z += 1;
      
      addObject(clonedMesh, `${source.name} (Copy)`, source.type);
      logger.info(`Object duplicated: ${clonedMesh.uuid}`);
    }
  }, [objects, addObject]);

  const copyToClipboard = useCallback((id: string) => {
    const source = objects.find(obj => obj.id === id);
    if (source && source.mesh) {
      const cloneForClipboard = source.mesh.clone();
      // Очищаємо клон відразу, щоб при вставці не було проблем з ID
      prepareClonedMesh(cloneForClipboard);
      setClipboard(cloneForClipboard);
      logger.info(`Object ${source.name} copied to clipboard`);
    }
  }, [objects]);

  const pasteFromClipboard = useCallback(() => {
    if (clipboard) {
      const meshToPaste = clipboard.clone();
      prepareClonedMesh(meshToPaste);
      
      meshToPaste.position.x += 0.5;
      meshToPaste.position.z += 0.5;
      
      addObject(meshToPaste, `Pasted ${meshToPaste.name}`, 'Mesh');
      logger.info('Object pasted from clipboard');
    }
  }, [clipboard, addObject]);

  // --- Інші методи ---

  const toggleEditMode = useCallback(() => setIsEditMode(prev => !prev), []);
  
  const setTransformModeHandler = useCallback((mode: 'translate' | 'rotate' | 'scale') => {
    setTransformMode(mode);
  }, []);

  const changeObjectColor = useCallback((id: string, color: number) => {
    const object = objects.find(obj => obj.id === id);
    if (object) {
      const mesh = object.mesh as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material) material.color.setHex(color);
    }
  }, [objects]);

  const updateObject = useCallback((id: string, updates: {
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
  }) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        const mesh = obj.mesh as THREE.Mesh;
        if (updates.name !== undefined) mesh.name = updates.name;
        if (updates.position) mesh.position.set(updates.position.x, updates.position.y, updates.position.z);
        if (updates.rotation) mesh.rotation.set(updates.rotation.x, updates.rotation.y, updates.rotation.z);
        return { ...obj, name: updates.name ?? obj.name };
      }
      return obj;
    }));
  }, []);

  const getTreeScene = useCallback(() => {
    const traverseObject = (obj: THREE.Object3D): any => ({
      id: obj.uuid,
      name: obj.name || 'Unnamed Object',
      type: obj.type,
      shape: (obj as THREE.Mesh).geometry?.type || null,
      children: obj.children.map(traverseObject),
    });
    return objects.map(obj => traverseObject(obj.mesh));
  }, [objects]);

  return useMemo(() => ({
    objects,
    selectedObjectId,
    clipboard,
    isEditMode,
    transformMode,
    addObject,
    removeObject,
    selectObject,
    clearSelection,
    toggleEditMode,
    setTransformMode: setTransformModeHandler,
    changeObjectColor,
    updateObject,
    getTreeScene,
    duplicateObject,
    copyToClipboard,
    pasteFromClipboard
  }), [
    objects, selectedObjectId, clipboard, isEditMode, transformMode,
    addObject, removeObject, selectObject, clearSelection, toggleEditMode,
    setTransformModeHandler, changeObjectColor, updateObject, getTreeScene,
    duplicateObject, copyToClipboard, pasteFromClipboard
  ]);
}
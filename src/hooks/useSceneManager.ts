'use client';

import { useState, useCallback } from 'react';
import * as THREE from 'three';

export type SceneObject = {
  id: string;
  mesh: THREE.Object3D;
};

export function useSceneManager() {
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // Додає новий об'єкт у сцену
  const addObject = useCallback((mesh: THREE.Object3D) => {
    setObjects(prev => [...prev, { id: mesh.uuid, mesh }]);
  }, []);

  // Видаляє об'єкт зі сцени
  const removeObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }, [selectedObjectId]);

  // Встановлює виділений об'єкт
  const selectObject = useCallback((id: string) => {
    setSelectedObjectId(id);
    
    // Скидаємо ефект виділення для всіх об'єктів
    objects.forEach(o => {
      const mesh = o.mesh as THREE.Mesh;
      const material = mesh?.material as THREE.MeshStandardMaterial;
      if (material?.emissive) {
        material.emissive.setHex(o.id === id ? 0x444400 : 0x000000);
      }
    });
  }, [objects]);

  // Знімає виділення
  const clearSelection = useCallback(() => {
    setSelectedObjectId(null);
    // Скидаємо ефект виділення для всіх об'єктів
    objects.forEach(o => {
      const mesh = o.mesh as THREE.Mesh;
      const material = mesh?.material as THREE.MeshStandardMaterial;
      if (material?.emissive) {
        material.emissive.setHex(0x000000);
      }
    });
  }, [objects]);

  // Перемикає режим редагування
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  // Змінює режим трансформації
  const setTransformModeHandler = useCallback((mode: 'translate' | 'rotate' | 'scale') => {
    setTransformMode(mode);
  }, []);

  return {
    objects,
    selectedObjectId,
    isEditMode,
    transformMode,
    addObject,
    removeObject,
    selectObject,
    clearSelection,
    toggleEditMode,
    setTransformMode: setTransformModeHandler,
  };
}

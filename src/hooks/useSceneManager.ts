'use client';

import { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { CollectionElementProps } from '@/components/UI/Collection/types';

export function useSceneManager() {
  const [objects, setObjects] = useState<CollectionElementProps[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // Додає новий об'єкт у сцену
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

  const getTreeScene = useCallback(() => {
    const traverseObject = (obj: THREE.Object3D, collectionObj?: CollectionElementProps): any => {
      // Використовуємо name з CollectionElementProps, якщо він є, інакше з mesh
      const name = collectionObj?.name || obj.name || 'Unnamed Object';
      
      return {
        id: obj.uuid,
        name: name,
        type: obj.type,
        shape: (obj as THREE.Mesh).geometry ? (obj as THREE.Mesh).geometry.type : null,
        children: obj.children.map(child => {
          // Знаходимо відповідний collection об'єкт для дочірнього елемента
          const childCollectionObj = collectionObj?.children?.find(c => c.id === child.uuid);
          return traverseObject(child, childCollectionObj);
        }),
      };
    };
    
    return objects.map(obj => traverseObject(obj.mesh, obj));
  }, [objects]);

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

  // Змінює основний колір об'єкта
  const changeObjectColor = useCallback((id: string, color: number) => {
    const object = objects.find(obj => obj.id === id);
    if (object) {
      const mesh = object.mesh as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material) {
        material.color.setHex(color);
      }
    }
  }, [objects]);

  // Оновлює об'єкт (назву, позицію, обертання тощо)
  const updateObject = useCallback((id: string, updates: {
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
  }) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        const updatedObj = { ...obj };
        const mesh = obj.mesh as THREE.Mesh;

        // Оновлення назви
        if (updates.name !== undefined) {
          updatedObj.name = updates.name;
          mesh.name = updates.name;
        }

        // Оновлення позиції
        if (updates.position) {
          mesh.position.set(updates.position.x, updates.position.y, updates.position.z);
        }

        // Оновлення обертання
        if (updates.rotation) {
          mesh.rotation.set(updates.rotation.x, updates.rotation.y, updates.rotation.z);
        }

        return updatedObj;
      }
      return obj;
    }));
  }, []);



  return useMemo(() => ({
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
    changeObjectColor,
    updateObject,
    getTreeScene,
  }), [
    objects,
    selectedObjectId,
    isEditMode,
    transformMode,
    addObject,
    removeObject,
    selectObject,
    clearSelection,
    toggleEditMode,
    setTransformModeHandler,
    changeObjectColor,
    updateObject,
    getTreeScene,
  ]);
}

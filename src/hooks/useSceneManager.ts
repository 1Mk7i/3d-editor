'use client';

import { useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { CollectionElementProps } from '@/components/UI/Collection/types';
import { useClipboard, ClipboardType, ParameterSubType } from './useClipboard';

export function useSceneManager() {
  const [objects, setObjects] = useState<CollectionElementProps[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  
  const { clipboard, copy, hasContent } = useClipboard();

  const prepareClonedMesh = useCallback((mesh: THREE.Object3D) => {
    const newMesh = mesh.clone();
    newMesh.uuid = THREE.MathUtils.generateUUID();
    newMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) child.uuid = THREE.MathUtils.generateUUID();
    });
    return newMesh;
  }, []);

  const addObject = useCallback((mesh: THREE.Object3D, name: string = 'New Object', type: string = mesh.type) => {
    setObjects(prev => [...prev, {
      id: mesh.uuid,
      mesh,
      name,
      type,
      // Гарантуємо, що shape не буде undefined
      shape: (mesh as THREE.Mesh).geometry?.type ?? 'BoxGeometry',
      children: []
    }]);
  }, []);

  const removeObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }, [selectedObjectId]);

  const selectObject = useCallback((id: string) => setSelectedObjectId(id), []);
  const clearSelection = useCallback(() => setSelectedObjectId(null), []);
  const toggleEditMode = useCallback(() => setIsEditMode(prev => !prev), []);
  const handleSetTransformMode = useCallback((mode: 'translate' | 'rotate' | 'scale') => setTransformMode(mode), []);

  const changeObjectColor = useCallback((id: string, color: number) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        const mesh = obj.mesh as THREE.Mesh;
        if (mesh.material) (mesh.material as THREE.MeshStandardMaterial).color.setHex(color);
        return { ...obj };
      }
      return obj;
    }));
  }, []);

  const updateObject = useCallback((id: string, updates: any) => {
    setObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        const mesh = obj.mesh as THREE.Mesh;
        if (updates.name !== undefined) mesh.name = updates.name;
        if (updates.position) mesh.position.set(updates.position.x, updates.position.y, updates.position.z);
        return { ...obj, name: updates.name ?? obj.name };
      }
      return obj;
    }));
  }, []);

  // ДОДАНО: функція для дерева, якої не вистачало
  const getTreeScene = useCallback(() => {
    return objects.map(obj => ({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      shape: obj.shape ?? null, // Важливо для сумісності з ObjectTreeNode
      children: []
    }));
  }, [objects]);

  const duplicateObject = useCallback((id: string) => {
    const source = objects.find(obj => obj.id === id);
    if (source) addObject(prepareClonedMesh(source.mesh), `${source.name} (Copy)`);
  }, [objects, addObject, prepareClonedMesh]);

  const copyToClipboard = useCallback((id: string, type: ClipboardType = 'object', subType?: ParameterSubType) => {
    const source = objects.find(obj => obj.id === id);
    if (!source || !source.mesh) return;

    const mesh = source.mesh as THREE.Mesh;
    const material = mesh.material as THREE.MeshStandardMaterial;

    let data: any;
    if (type === 'object') {
        data = mesh; 
    } else {
        switch (subType) {
            case 'color': data = material.color.getHex(); break;
            case 'position': data = mesh.position.clone(); break;
            case 'scale': data = mesh.scale.clone(); break;
            case 'rotation': data = mesh.rotation.clone(); break;
            default: data = material.color.getHex();
        }
    }
    copy(data, type, subType);
  }, [objects, copy]);

  const pasteFromClipboard = useCallback((targetId?: string, forceType?: ClipboardType) => {
    if (!clipboard) return;

    const id = targetId || selectedObjectId;
    const { type, subType, data } = clipboard;
    const activeType = forceType || type;

    if (activeType === 'object') {
        const sourceMesh = data as THREE.Object3D;
        const newMesh = prepareClonedMesh(sourceMesh);
        newMesh.position.x += 1; 
        addObject(newMesh, `${sourceMesh.name || 'Object'} (Copy)`);
    } 
    else if (activeType === 'parameter' && id) {
        setObjects(prev => prev.map(obj => {
            if (obj.id !== id) return obj;
            const mesh = obj.mesh as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;

            if (type === 'object') {
                const sMesh = data as THREE.Mesh;
                mat.color.copy((sMesh.material as THREE.MeshStandardMaterial).color);
                mesh.scale.copy(sMesh.scale);
            } else {
                switch (subType) {
                    case 'color': mat.color.setHex(data); break;
                    case 'position': mesh.position.copy(data); break;
                    case 'scale': mesh.scale.copy(data); break;
                    case 'rotation': mesh.rotation.copy(data); break;
                }
            }
            return { ...obj };
        }));
    }
  }, [clipboard, selectedObjectId, addObject, prepareClonedMesh]);

  return useMemo(() => ({
    objects,
    selectedObjectId,
    isEditMode,
    transformMode,
    hasClipboardContent: hasContent,
    clipboardType: clipboard?.type,
    clipboardSubType: clipboard?.subType,
    clipboard,
    addObject,
    removeObject,
    selectObject,
    clearSelection,
    toggleEditMode,
    setTransformMode: handleSetTransformMode,
    changeObjectColor,
    updateObject,
    getTreeScene, // Тепер вона визначена вище
    duplicateObject,
    copyToClipboard,
    pasteFromClipboard
  }), [
    objects, selectedObjectId, isEditMode, transformMode, hasContent, clipboard,
    addObject, removeObject, selectObject, clearSelection, toggleEditMode,
    handleSetTransformMode, changeObjectColor, updateObject, getTreeScene, 
    duplicateObject, copyToClipboard, pasteFromClipboard
  ]);
}
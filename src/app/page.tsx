"use client";

import ThreeScene from '@/components/UI/Scene/ThreeScene';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useSceneManager } from '@/hooks/useSceneManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import React from 'react';
import * as THREE from 'three';

import Menu from '@/components/UI/Menu/Menu';
import Button from '@/components/UI/Button/Button';

export default function Home() {
  const contextMenu = useContextMenu();
  const windowManager = useWindowManager();
  const sceneManager = useSceneManager();
  const menuItems = React.useMemo(() => createContextMenuItems(windowManager.openWindow), [windowManager.openWindow]);

  const createNewMesh = () => {
    return new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 'red' })
    );
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      onContextMenu={contextMenu.showContextMenu}
    >
      <Menu 
        title='3D Editor'
      />
      <Menu
        style={{ backgroundColor: 'gray', top: 60, left: 0, width: '200px', height: 'calc(100% - 60px)' }} 
        title='Left Menu'
        children={<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button label='Create' onClick={() => sceneManager.addObject(createNewMesh())} />
          <Button 
            label={sceneManager.isEditMode ? 'Exit Edit' : 'Edit'} 
            onClick={sceneManager.toggleEditMode}
            style={{ backgroundColor: sceneManager.isEditMode ? '#ff6b6b' : '#4ecdc4' }}
          />
          {sceneManager.isEditMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
              <small style={{ color: '#666' }}>Transform Mode:</small>
              <Button 
                label='Move' 
                onClick={() => sceneManager.setTransformMode('translate')}
                style={{ backgroundColor: sceneManager.transformMode === 'translate' ? '#ffe66d' : '#ddd' }}
              />
              <Button 
                label='Rotate' 
                onClick={() => sceneManager.setTransformMode('rotate')}
                style={{ backgroundColor: sceneManager.transformMode === 'rotate' ? '#ffe66d' : '#ddd' }}
              />
              <Button 
                label='Scale' 
                onClick={() => sceneManager.setTransformMode('scale')}
                style={{ backgroundColor: sceneManager.transformMode === 'scale' ? '#ffe66d' : '#ddd' }}
              />
            </div>
          )}
          <Button label='Delete' onClick={() => {
            if (sceneManager.selectedObjectId) {
              sceneManager.removeObject(sceneManager.selectedObjectId);
            }
          }} />
        </div>}
      />
      <Menu
        style={{ backgroundColor: 'gray', top: 60, right: 0, width: '200px', height: 'calc(100% - 60px)' }} 
        title='Tree'
      />
  <ThreeScene 
    objects={sceneManager.objects} 
    selectObject={sceneManager.selectObject} 
    selectedObjectId={sceneManager.selectedObjectId} 
    clearSelection={sceneManager.clearSelection}
    isEditMode={sceneManager.isEditMode}
    transformMode={sceneManager.transformMode}
  />
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        items={menuItems}
        onClose={contextMenu.hideContextMenu}
      />
    </div>
  );
}

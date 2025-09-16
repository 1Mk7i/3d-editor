"use client";

import ThreeScene from '@/components/UI/Scene/ThreeScene';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import React from 'react';

import Menu from '@/components/UI/Menu/Menu';
import Button from '@/components/UI/Button/Button';

export default function Home() {
  const contextMenu = useContextMenu();
  const windowManager = useWindowManager();
  const menuItems = React.useMemo(() => createContextMenuItems(windowManager.openWindow), [windowManager.openWindow]);

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
          <Button label='Create' onClick={() => alert('Object created')} />
          <Button label='Edit' onClick={() => alert('Edit mode enabled')} />
          <Button label='Delete' onClick={() => alert('Object deleted')} />
        </div>}
      />
      <Menu
        style={{ backgroundColor: 'gray', top: 60, right: 0, width: '200px', height: 'calc(100% - 60px)' }} 
        title='Tree'
      />
      <ThreeScene />
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        items={menuItems}
        onClose={contextMenu.hideContextMenu}
      />
    </div>
  );
}

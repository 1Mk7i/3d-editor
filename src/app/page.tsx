"use client";

import ThreeScene from '@/components/ThreeScene';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useWindowManager } from '@/hooks/useWindowManager';
import { createContextMenuItems } from '@/config/contextMenuConfig';
import React from 'react';

import Menu from '@/components/UI/Menu';

export default function Home() {
  const contextMenu = useContextMenu();
  const windowManager = useWindowManager();
  const menuItems = React.useMemo(() => createContextMenuItems(windowManager.openWindow), [windowManager.openWindow]);

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      onContextMenu={contextMenu.showContextMenu}
    >
      <Menu />
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

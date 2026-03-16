import React from 'react';
import * as THREE from 'three';
import { ContextMenuItem } from '../components/ContextMenu/ContextMenu';
import {
  DeleteIcon,
  SettingsIcon,
  InfoIcon,
  WindowIcon,
  CreateIcon,
} from '../components/ContextMenu/Icons';

import { WindowType } from '@/shared/types/common.types';
import { SceneManager } from '@/shared/types/scene.types';
import { logger, logError } from '@/shared/utils/logger';
// Імпортуємо ваші типи та константи
import { THREE_OBJECT_TYPES, ThreeObjectType, createThreeObject } from '../shared/constants/threeObjects';

export const createContextMenuItems = (
  openWindow: (type: WindowType) => void,
  sceneManager: SceneManager
): ContextMenuItem[] => {
  
  // Функція-хелпер для створення об'єкта
  const handleCreateObject = (type: ThreeObjectType) => {
    logger.debug('CONTEXT_MENU', `Create ${type.id} clicked`);
    try {
      const mesh = createThreeObject(type);
      sceneManager.addObject(mesh, type.name, 'Mesh');
      logger.info(`${type.name} added successfully`);
    } catch (error) {
      logError(`adding ${type.id} to scene`, error);
    }
  };

  return [
    {
      id: 'create',
      label: 'Створити',
      icon: <CreateIcon />,
      submenu: THREE_OBJECT_TYPES.map((type) => ({
        id: `create-${type.id}`,
        label: type.name,
        icon: type.icon ? <img src={type.icon} alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1) drop-shadow(0.5px 0px 0px rgba(255,255,255,0.5)) drop-shadow(-0.5px 0px 0px rgba(255,255,255,0.5))' }} /> : <CreateIcon />,
        onClick: () => handleCreateObject(type),
      })),
    },
    { id: 'sep1', separator: true },
    {
      id: 'delete',
      label: 'Видалити',
      icon: <DeleteIcon />,
      danger: true,
      onClick: () => {
        if (sceneManager.selectedObjectId) {
          sceneManager.removeObject(sceneManager.selectedObjectId);
        }
      },
    },
    { id: 'sep2', separator: true },
    {
      id: 'windows',
      label: 'Вікна',
      icon: <WindowIcon />,
      submenu: [
        {
          id: 'open-chat',
          label: 'AI Чат',
          icon: <WindowIcon />,
          onClick: () => openWindow('chat'),
        },
        {
          id: 'open-settings',
          label: 'Налаштування',
          icon: <SettingsIcon />,
          onClick: () => openWindow('settings'),
        }
      ],
    },
    { id: 'sep3', separator: true },
    {
      id: 'properties',
      label: 'Властивості',
      icon: <InfoIcon />,
      onClick: () => logger.info('Properties action triggered'),
    },
  ];
};
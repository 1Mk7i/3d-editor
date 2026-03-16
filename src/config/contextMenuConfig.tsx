import React from 'react';
import * as THREE from 'three';
import { ContextMenuItem } from '../components/ContextMenu/ContextMenuContext';
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
import { THREE_OBJECT_TYPES, ThreeObjectType, createThreeObject } from '../shared/constants/threeObjects';

export const createContextMenuItems = (
  openWindow: (type: WindowType) => void,
  sceneManager: SceneManager,
  clipboardExists: boolean,
  actions?: {
    copy: (id: string) => void;
    paste: () => void;
    duplicate: (id: string) => void;
  }
): ContextMenuItem[] => {
  
  const handleCreateObject = (type: ThreeObjectType) => {
    logger.debug('CONTEXT_MENU', `Create ${type.id} clicked`);
    try {
      const mesh = createThreeObject(type);
      sceneManager.addObject(mesh, type.name, 'Mesh');
    } catch (error) {
      logError(`adding ${type.id} to scene`, error);
    }
  };

  const selectedId = sceneManager.selectedObjectId;

  return [
    {
      id: 'create',
      label: 'Створити',
      icon: <CreateIcon />,
      submenu: THREE_OBJECT_TYPES.map((type) => ({
        id: `create-${type.id}`,
        label: type.name,
        icon: type.icon ? (
          <img 
            src={type.icon} 
            alt="" 
            style={{ 
              width: 16, 
              height: 16, 
              filter: 'brightness(0) invert(1)' 
            }} 
          />
        ) : <CreateIcon />,
        onClick: () => handleCreateObject(type),
      })),
    },
    { id: 'sep1', separator: true },
    {
      id: 'copy',
      label: 'Копіювати',
      disabled: !selectedId,
      onClick: () => {
        if (selectedId && actions?.copy) actions.copy(selectedId);
      }
    },
    {
      id: 'duplicate',
      label: 'Дублювати',
      disabled: !selectedId,
      onClick: () => {
        if (selectedId && actions?.duplicate) actions.duplicate(selectedId);
      }
    },
    {
      id: 'paste',
      label: 'Вставити',
      disabled: !clipboardExists, // Тільки якщо є що вставляти
      onClick: () => {
        if (actions?.paste) actions.paste();
      }
    },
    {
      id: 'delete',
      label: 'Видалити',
      icon: <DeleteIcon />,
      danger: true,
      disabled: !selectedId,
      onClick: () => {
        if (selectedId) {
          sceneManager.removeObject(selectedId);
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
      disabled: !selectedId,
      onClick: () => logger.info(`Properties for ${selectedId}`),
    },
  ];
};
import React from 'react';
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
import { ClipboardType, ParameterSubType } from '@/hooks/useClipboard';

export const createContextMenuItems = (
  openWindow: (type: WindowType) => void,
  sceneManager: SceneManager,
  clipboardExists: boolean,
  clipboardType?: ClipboardType,
  clipboardSubType?: ParameterSubType,
  actions?: {
    copy: (id: string, type?: ClipboardType, subType?: ParameterSubType) => void;
    paste: (targetId?: string, forceType?: ClipboardType) => void;
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

  // Формування динамічного підменю вставки
  const getPasteSubmenu = (): ContextMenuItem[] | undefined => {
    if (!clipboardExists) return undefined;

    const items: ContextMenuItem[] = [];

    if (clipboardType === 'object') {
      items.push({
        id: 'paste-new',
        label: "Як новий об'єкт",
        onClick: () => actions?.paste(),
      });

      if (selectedId) {
        items.push({
          id: 'paste-style',
          label: 'Тільки стиль (Колір + Масштаб)',
          onClick: () => actions?.paste(selectedId, 'parameter'),
        });
      }
    } else if (clipboardType === 'parameter' && selectedId) {
      const subLabels: Record<string, string> = {
        color: 'колір',
        scale: 'масштаб',
        position: 'позицію',
        rotation: 'поворот',
        opacity: 'прозорість',
        material: 'матеріал'
      };
      items.push({
        id: 'paste-param',
        label: `Вставити ${subLabels[clipboardSubType || ''] || 'параметр'}`,
        onClick: () => actions?.paste(selectedId),
      });
    }

    return items.length > 0 ? items : undefined;
  };

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
            style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} 
          />
        ) : <CreateIcon />,
        onClick: () => handleCreateObject(type),
      })),
    },
    { id: 'sep1', separator: true },
    {
      id: 'copy-group',
      label: 'Копіювати...',
      disabled: !selectedId,
      submenu: [
        {
          id: 'copy-full',
          label: "Весь об'єкт",
          onClick: () => selectedId && actions?.copy(selectedId, 'object'),
        },
        { id: 'sep-copy', separator: true },
        { id: 'cp-color', label: 'Тільки колір', onClick: () => selectedId && actions?.copy(selectedId, 'parameter', 'color') },
        { id: 'cp-scale', label: 'Тільки масштаб', onClick: () => selectedId && actions?.copy(selectedId, 'parameter', 'scale') },
        { id: 'cp-pos', label: 'Тільки позицію', onClick: () => selectedId && actions?.copy(selectedId, 'parameter', 'position') },
        { id: 'cp-mat', label: 'Матеріал повністю', onClick: () => selectedId && actions?.copy(selectedId, 'parameter', 'material') },
      ]
    },
    {
      id: 'paste-group',
      label: 'Вставити...',
      disabled: !clipboardExists || (clipboardType === 'parameter' && !selectedId),
      submenu: getPasteSubmenu(),
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
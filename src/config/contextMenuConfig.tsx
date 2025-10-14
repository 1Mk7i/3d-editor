import React from 'react';
import { ContextMenuItem } from '../components/ContextMenu/ContextMenu';
import {
  CopyIcon,
  CutIcon,
  PasteIcon,
  DeleteIcon,
  EditIcon,
  FileIcon,
  FolderIcon,
  RefreshIcon,
  SettingsIcon,
  InfoIcon,
  CalculatorIcon,
  WindowIcon,
  CreateIcon,
} from '../components/ContextMenu/Icons';

import { Mesh, BoxGeometry, SphereGeometry, CylinderGeometry, TorusGeometry, MeshStandardMaterial } from 'three';
import { WindowType } from '@/shared/types/common.types';
import { SceneManager } from '@/shared/types/scene.types';
import { MATERIAL_COLORS, GEOMETRY_DEFAULTS } from '@/shared/constants/scene.constants';
import { logger, logError } from '@/shared/utils/logger';

/**
 * Створює конфігурацію контекстного меню
 * @param openWindow - функція для відкриття вікон з useWindowManager
 * @param sceneManager - менеджер сцени для додавання об'єктів
 * @returns масив елементів контекстного меню
 */
export const createContextMenuItems = (
  openWindow: (type: WindowType) => void,
  sceneManager: SceneManager
): ContextMenuItem[] => {
  logger.debug('CONTEXT_MENU', 'Creating context menu items', { sceneManager });
  
  return [
    {
      id: 'create',
      label: 'Створити',
      icon: <CreateIcon />,
      submenu: [
        {
          id: 'create-cube',
          label: 'Куб',
          icon: <CreateIcon />,
          onClick: () => {
            logger.debug('CONTEXT_MENU', 'Create cube clicked');
            try {
              const geometry = new BoxGeometry(
                GEOMETRY_DEFAULTS.CUBE.width,
                GEOMETRY_DEFAULTS.CUBE.height,
                GEOMETRY_DEFAULTS.CUBE.depth
              );
              const material = new MeshStandardMaterial({ 
                color: MATERIAL_COLORS.CUBE,
                emissive: MATERIAL_COLORS.UNSELECTED 
              });
              const cube = new Mesh(geometry, material);
              cube.position.set(0, 0, 0);
              cube.name = 'Куб';
              
              sceneManager.addObject(cube, 'Куб', 'Mesh');
              logger.info('Cube added successfully');
            } catch (error) {
              logError('adding cube to scene', error);
            }
          }
        },
        {
          id: 'create-sphere',
          label: 'Сфера',
          icon: <CreateIcon />,
          onClick: () => {
            logger.debug('CONTEXT_MENU', 'Create sphere clicked');
            try {
              const geometry = new SphereGeometry(
                GEOMETRY_DEFAULTS.SPHERE.radius,
                GEOMETRY_DEFAULTS.SPHERE.widthSegments,
                GEOMETRY_DEFAULTS.SPHERE.heightSegments
              );
              const material = new MeshStandardMaterial({ 
                color: MATERIAL_COLORS.SPHERE,
                emissive: MATERIAL_COLORS.UNSELECTED 
              });
              const sphere = new Mesh(geometry, material);
              sphere.position.set(0, 0, 0);
              sphere.name = 'Сфера';
              
              sceneManager.addObject(sphere, 'Сфера', 'Mesh');
              logger.info('Sphere added successfully');
            } catch (error) {
              logError('adding sphere to scene', error);
            }
          }
        },
        {
          id: 'create-cylinder',
          label: 'Циліндр',
          icon: <CreateIcon />,
          onClick: () => {
            logger.debug('CONTEXT_MENU', 'Create cylinder clicked');
            try {
              const geometry = new CylinderGeometry(
                GEOMETRY_DEFAULTS.CYLINDER.radiusTop,
                GEOMETRY_DEFAULTS.CYLINDER.radiusBottom,
                GEOMETRY_DEFAULTS.CYLINDER.height,
                GEOMETRY_DEFAULTS.CYLINDER.radialSegments
              );
              const material = new MeshStandardMaterial({ 
                color: MATERIAL_COLORS.CYLINDER,
                emissive: MATERIAL_COLORS.UNSELECTED
              });
              const cylinder = new Mesh(geometry, material);
              cylinder.position.set(0, 0, 0);
              cylinder.name = 'Циліндр';
              
              sceneManager.addObject(cylinder, 'Циліндр', 'Mesh');
              logger.info('Cylinder added successfully');
            } catch (error) {
              logError('adding cylinder to scene', error);
            }
          }
        },
        {
          id: 'create-torus',
          label: 'Тор',
          icon: <CreateIcon />,
          onClick: () => {
            logger.debug('CONTEXT_MENU', 'Create torus clicked');
            try {
              const geometry = new TorusGeometry(
                GEOMETRY_DEFAULTS.TORUS.radius,
                GEOMETRY_DEFAULTS.TORUS.tube,
                GEOMETRY_DEFAULTS.TORUS.radialSegments,
                GEOMETRY_DEFAULTS.TORUS.tubularSegments
              );
              const material = new MeshStandardMaterial({
                color: MATERIAL_COLORS.TORUS,
                emissive: MATERIAL_COLORS.UNSELECTED
              });
              const torus = new Mesh(geometry, material);
              torus.position.set(0, 0, 0);
              torus.name = 'Тор';

              sceneManager.addObject(torus, 'Тор', 'Mesh');
              logger.info('Torus added successfully');
            } catch (error) {
              logError('adding torus to scene', error);
            }
          }
        },
      ]
    },
    {
      id: 'separator1',
      separator: true,
    },
    {
      id: 'cut',
      label: 'Вирізати',
      icon: <CutIcon />,
      shortcut: 'Ctrl+X',
      onClick: () => logger.info('Cut action triggered'),
    },
    {
      id: 'copy',
      label: 'Копіювати',
      icon: <CopyIcon />,
      shortcut: 'Ctrl+C',
      onClick: () => logger.info('Copy action triggered'),
    },
    {
      id: 'paste',
      label: 'Вставити',
      icon: <PasteIcon />,
      shortcut: 'Ctrl+V',
      onClick: () => logger.info('Paste action triggered'),
    },
    {
      id: 'separator2',
      separator: true,
    },
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
    {
      id: 'separator3',
      separator: true,
    },
    {
      id: 'windows',
      label: 'Вікна',
      icon: <WindowIcon />,
      submenu: [
        {
          id: 'open-chat',
          label: 'AI Чат',
          icon: <WindowIcon />,
          onClick: () => openWindow('ai-chat'),
        },
        {
          id: 'open-calculator',
          label: 'Калькулятор',
          icon: <CalculatorIcon />,
          onClick: () => openWindow('calculator'),
        },
        {
          id: 'open-file-manager',
          label: 'Файловий менеджер',
          icon: <FileIcon />,
          onClick: () => openWindow('file-manager'),
        },
      ],
    },
    {
      id: 'separator4',
      separator: true,
    },
    {
      id: 'properties',
      label: 'Властивості',
      icon: <InfoIcon />,
      onClick: () => logger.info('Properties action triggered'),
    },
  ];
};

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

import * as THREE from 'three';

export type WindowType = 'ai-chat' | 'calculator' | 'file-manager';

/**
 * Створює конфігурацію контекстного меню
 * @param openWindow - функція для відкриття вікон з useWindowManager
 * @param sceneManager - менеджер сцени для додавання об'єктів
 * @returns масив елементів контекстного меню
 */
export const createContextMenuItems = (
  openWindow: (type: WindowType) => void,
  sceneManager: any
): ContextMenuItem[] => {
  console.log('=== CREATING CONTEXT MENU ITEMS ===');
  console.log('sceneManager:', sceneManager);
  console.log('sceneManager.addObject:', sceneManager.addObject);
  
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
            console.log('=== CREATE CUBE CLICKED ===');
            // alert('Create Cube clicked!');
            try {
              // Створюємо куб
              const geometry = new THREE.BoxGeometry(1, 1, 1);
              const material = new THREE.MeshStandardMaterial({ 
                color: 0x00ff00,
                emissive: 0x000000 
              });
              const cube = new THREE.Mesh(geometry, material);
              cube.position.set(0, 0, 0);
              
              console.log('Created cube:', cube);
              sceneManager.addObject(cube);
              console.log('Cube added successfully');
            } catch (error) {
              console.error('Error adding cube:', error);
            }
          }
        },
        {
          id: 'create-sphere',
          label: 'Сфера',
          icon: <CreateIcon />,
          onClick: () => {
            console.log('=== CREATE SPHERE CLICKED ===');
            // alert('Create Sphere clicked!');
            try {
              // Створюємо сферу
              const geometry = new THREE.SphereGeometry(0.5, 32, 32);
              const material = new THREE.MeshStandardMaterial({ 
                color: 0x0000ff,
                emissive: 0x000000 
              });
              const sphere = new THREE.Mesh(geometry, material);
              sphere.position.set(0, 0, 0);
              
              console.log('Created sphere:', sphere);
              sceneManager.addObject(sphere);
              console.log('Sphere added successfully');
            } catch (error) {
              console.error('Error adding sphere:', error);
            }
          }
        },
        {
          id: 'create-cylinder',
          label: 'Циліндр',
          icon: <CreateIcon />,
          onClick: () => {
            console.log('=== CREATE CYLINDER CLICKED ===');
            try {
              // Створюємо циліндр
              const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
              const material = new THREE.MeshStandardMaterial({ 
                color: 0xff0000,
                emissive: 0x000000
              });
              const cylinder = new THREE.Mesh(geometry, material);
              cylinder.position.set(0, 0, 0);
              
              console.log('Created cylinder:', cylinder);
              sceneManager.addObject(cylinder);
              console.log('Cylinder added successfully');
            } catch (error) {
              console.error('Error adding cylinder:', error);
            }
          }
        },
        {
          id: 'create-torus',
          label: 'Тор',
          icon: <CreateIcon />,
          onClick: () => {
            console.log('=== CREATE TORUS CLICKED ===');
            try {
              // Створюємо тор
              const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
              const material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0x000000
              });
              const torus = new THREE.Mesh(geometry, material);
              torus.position.set(0, 0, 0);

              console.log('Created torus:', torus);
              sceneManager.addObject(torus);
              console.log('Torus added successfully');
            } catch (error) {
              console.error('Error adding torus:', error);
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
      onClick: () => console.log('Cut clicked'),
    },
    {
      id: 'copy',
      label: 'Копіювати',
      icon: <CopyIcon />,
      shortcut: 'Ctrl+C',
      onClick: () => console.log('Copy clicked'),
    },
    {
      id: 'paste',
      label: 'Вставити',
      icon: <PasteIcon />,
      shortcut: 'Ctrl+V',
      onClick: () => console.log('Paste clicked'),
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
      onClick: () => console.log('Properties clicked'),
    },
  ];
};
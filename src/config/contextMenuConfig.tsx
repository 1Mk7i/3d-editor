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

/**
 * Створює конфігурацію контекстного меню
 * @param openWindow - функція для відкриття вікон з useWindowManager
 * @returns масив елементів контекстного меню
 */
export const createContextMenuItems = (openWindow: (id: string, props?: any) => void): ContextMenuItem[] => [
  {
    id: 'copy',
    label: 'Копіювати',
    icon: <CopyIcon />,
    shortcut: 'Ctrl+C',
    onClick: () => alert('Копіювання виконано!'),
  },
  {
    id: 'cut',
    label: 'Вирізати',
    icon: <CutIcon />,
    shortcut: 'Ctrl+X',
    onClick: () => alert('Вирізання виконано!'),
  },
  {
    id: 'paste',
    label: 'Вставити',
    icon: <PasteIcon />,
    shortcut: 'Ctrl+V',
    onClick: () => alert('Вставлення виконано!'),
  },
  {
    id: 'separator1',
    separator: true,
  },
  {
    id: 'new',
    label: 'Створити',
    icon: <CreateIcon />,
    submenu: [
      {
        id: 'new-file',
        label: 'Куб',
        icon: <FileIcon />,
        onClick: () => alert('Створення нового об\'єкта...'),
      },
      {
        id: 'new-folder',
        label: 'Сфера',
        icon: <FileIcon />,
        onClick: () => alert('Створення нової сфери...'),
      },
      {
        id: 'separator-apps',
        separator: true,
      },
    ],
  },
  {
    id: 'edit',
    label: 'Редагувати',
    icon: <EditIcon />,
    shortcut: 'F2',
    onClick: () => alert('Редагування...'),
  },
  {
    id: 'delete',
    label: 'Видалити',
    icon: <DeleteIcon />,
    shortcut: 'Del',
    danger: true,
    onClick: () => {
      if (confirm('Ви впевнені, що хочете видалити?')) {
        alert('Елемент видалено!');
      }
    },
  },
  {
    id: 'separator2',
    separator: true,
  },
  {
    id: 'refresh',
    label: 'Оновити',
    icon: <RefreshIcon />,
    shortcut: 'F5',
    onClick: () => {
      window.location.reload();
    },
  },
  {
    id: 'separator3',
    separator: true,
  },
  {
    id: 'info',
    label: 'Інформація',
    icon: <InfoIcon />,
    onClick: () => alert('Версія: 1.0'),
  },
  {
    id: 'disabled-item',
    label: 'Недоступна опція',
    icon: <SettingsIcon />,
    disabled: true,
    onClick: () => alert('Цей пункт недоступний'),
  },
];

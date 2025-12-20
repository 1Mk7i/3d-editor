'use client';

import * as THREE from 'three';

export interface ThreeObjectType {
  id: string;
  name: string;
  icon?: string; // URL до SVG іконки або placeholder
  createGeometry: () => THREE.BufferGeometry;
  defaultColor?: number;
}

export const THREE_OBJECT_TYPES: ThreeObjectType[] = [
  {
    id: 'box',
    name: 'Куб',
    icon: 'https://via.placeholder.com/24/4CAF50/FFFFFF?text=□',
    createGeometry: () => new THREE.BoxGeometry(1, 1, 1),
    defaultColor: 0x4CAF50,
  },
  {
    id: 'sphere',
    name: 'Сфера',
    icon: 'https://via.placeholder.com/24/2196F3/FFFFFF?text=○',
    createGeometry: () => new THREE.SphereGeometry(0.5, 32, 32),
    defaultColor: 0x2196F3,
  },
  {
    id: 'cylinder',
    name: 'Циліндр',
    icon: 'https://via.placeholder.com/24/FF9800/FFFFFF?text=◯',
    createGeometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    defaultColor: 0xFF9800,
  },
  {
    id: 'cone',
    name: 'Конус',
    icon: 'https://via.placeholder.com/24/9C27B0/FFFFFF?text=△',
    createGeometry: () => new THREE.ConeGeometry(0.5, 1, 32),
    defaultColor: 0x9C27B0,
  },
  {
    id: 'torus',
    name: 'Тор',
    icon: 'https://via.placeholder.com/24/E91E63/FFFFFF?text=◉',
    createGeometry: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    defaultColor: 0xE91E63,
  },
  {
    id: 'torusKnot',
    name: 'Вузол тора',
    icon: 'https://via.placeholder.com/24/00BCD4/FFFFFF?text=∞',
    createGeometry: () => new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16),
    defaultColor: 0x00BCD4,
  },
  {
    id: 'octahedron',
    name: 'Октаедр',
    icon: 'https://via.placeholder.com/24/FF5722/FFFFFF?text=⬡',
    createGeometry: () => new THREE.OctahedronGeometry(0.5),
    defaultColor: 0xFF5722,
  },
  {
    id: 'tetrahedron',
    name: 'Тетраедр',
    icon: 'https://via.placeholder.com/24/795548/FFFFFF?text=▲',
    createGeometry: () => new THREE.TetrahedronGeometry(0.5),
    defaultColor: 0x795548,
  },
  {
    id: 'icosahedron',
    name: 'Ікосаедр',
    icon: 'https://via.placeholder.com/24/607D8B/FFFFFF?text=⬟',
    createGeometry: () => new THREE.IcosahedronGeometry(0.5),
    defaultColor: 0x607D8B,
  },
  {
    id: 'dodecahedron',
    name: 'Додекаедр',
    icon: 'https://via.placeholder.com/24/3F51B5/FFFFFF?text=⬢',
    createGeometry: () => new THREE.DodecahedronGeometry(0.5),
    defaultColor: 0x3F51B5,
  },
  {
    id: 'plane',
    name: 'Площина',
    icon: 'https://via.placeholder.com/24/009688/FFFFFF?text=▭',
    createGeometry: () => new THREE.PlaneGeometry(1, 1),
    defaultColor: 0x009688,
  },
  {
    id: 'ring',
    name: 'Кільце',
    icon: 'https://via.placeholder.com/24/CDDC39/FFFFFF?text=○',
    createGeometry: () => new THREE.RingGeometry(0.3, 0.5, 32),
    defaultColor: 0xCDDC39,
  },
  {
    id: 'tube',
    name: 'Труба',
    icon: 'https://via.placeholder.com/24/FFC107/FFFFFF?text=⊚',
    createGeometry: () => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0, 0),
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(0.5, 0, 0),
      ]);
      return new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
    },
    defaultColor: 0xFFC107,
  },
  {
    id: 'lathe',
    name: 'Обертання',
    icon: 'https://via.placeholder.com/24/FF6F00/FFFFFF?text=◐',
    createGeometry: () => {
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.3, (i - 5) * 0.1));
      }
      return new THREE.LatheGeometry(points, 20);
    },
    defaultColor: 0xFF6F00,
  },
  {
    id: 'capsule',
    name: 'Капсула',
    icon: 'https://via.placeholder.com/24/8BC34A/FFFFFF?text=◉',
    createGeometry: () => new THREE.CapsuleGeometry(0.3, 0.8, 4, 8),
    defaultColor: 0x8BC34A,
  },
];

/**
 * Створює об'єкт Three.js з заданою геометрією
 */
export function createThreeObject(objectType: ThreeObjectType): THREE.Mesh {
  const geometry = objectType.createGeometry();
  const material = new THREE.MeshStandardMaterial({
    color: objectType.defaultColor || 0x00ff00,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.name = objectType.name;
  return mesh;
}


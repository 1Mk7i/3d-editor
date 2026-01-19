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
    icon: 'https://www.svgrepo.com/show/221247/cube.svg',
    createGeometry: () => new THREE.BoxGeometry(1, 1, 1),
    defaultColor: 0x4CAF50,
  },
  {
    id: 'sphere',
    name: 'Сфера',
    icon: 'https://www.svgrepo.com/show/221292/sphere.svg',
    createGeometry: () => new THREE.SphereGeometry(0.5, 32, 32),
    defaultColor: 0x2196F3,
  },
  {
    id: 'cylinder',
    name: 'Циліндр',
    icon: 'https://www.svgrepo.com/show/221262/cylinder.svg',
    createGeometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    defaultColor: 0xFF9800,
  },
  {
    id: 'cone',
    name: 'Конус',
    icon: 'https://www.svgrepo.com/show/221246/cone.svg',
    createGeometry: () => new THREE.ConeGeometry(0.5, 1, 32),
    defaultColor: 0x9C27B0,
  },
  {
    id: 'torus',
    name: 'Тор',
    icon: '/assets/shapes/noun-torus-405767.svg',
    createGeometry: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100),
    defaultColor: 0xE91E63,
  },
  {
    id: 'torusKnot',
    name: 'Вузол тора',
    icon: '/assets/shapes/noun-torus-405766.svg',
    createGeometry: () => new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16),
    defaultColor: 0x00BCD4,
  },
  {
    id: 'octahedron',
    name: 'Октаедр',
    icon: 'https://www.svgrepo.com/show/221283/octahedron.svg',
    createGeometry: () => new THREE.OctahedronGeometry(0.5),
    defaultColor: 0xFF5722,
  },
  {
    id: 'tetrahedron',
    name: 'Тетраедр',
    icon: 'https://www.svgrepo.com/show/221294/tetrahedron.svg',
    createGeometry: () => new THREE.TetrahedronGeometry(0.5),
    defaultColor: 0x795548,
  },
  {
    id: 'icosahedron',
    name: 'Ікосаедр',
    icon: 'https://www.svgrepo.com/show/221276/icosahedron.svg',
    createGeometry: () => new THREE.IcosahedronGeometry(0.5),
    defaultColor: 0x607D8B,
  },
  {
    id: 'dodecahedron',
    name: 'Додекаедр',
    icon: 'https://www.svgrepo.com/show/221270/dodecahedron.svg',
    createGeometry: () => new THREE.DodecahedronGeometry(0.5),
    defaultColor: 0x3F51B5,
  },
  {
    id: 'plane',
    name: 'Площина',
    icon: 'https://www.svgrepo.com/show/221293/square.svg',
    createGeometry: () => new THREE.PlaneGeometry(1, 1),
    defaultColor: 0x009688,
  },
  {
    id: 'ring',
    name: 'Кільце',
    icon: 'https://www.svgrepo.com/show/221249/circle-oval.svg',
    createGeometry: () => new THREE.RingGeometry(0.3, 0.5, 32),
    defaultColor: 0xCDDC39,
  },
  {
    id: 'tube',
    name: 'Труба',
    icon: '/assets/shapes/noun-half-torus-5738959.svg',
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
    icon: '/assets/shapes/noun-sphere-104196.svg',
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
    icon: '/assets/shapes/noun-capsule-5738793.svg',
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


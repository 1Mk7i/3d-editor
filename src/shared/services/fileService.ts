'use client';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter.js';
import { CollectionElementProps } from '@/components/UI/Collection/types';
import { FileFormat } from '@/components/UI/Layaout/FileMenu/FileDialog';

export interface SceneData {
  version: string;
  objects: SceneObjectData[];
  metadata?: {
    exportDate: string;
    format: FileFormat;
  };
}

export interface SceneObjectData {
  id: string;
  name: string;
  type: string;
  shape: string | null;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color?: number;
  materialType?: 'standard' | 'wireframe' | 'points';
  geometry?: {
    type: string;
    parameters: Record<string, any>;
  };
  children?: SceneObjectData[];
}

/**
 * Експортує сцену в JSON формат
 */
export function exportToJSON(objects: CollectionElementProps[]): string {
  const sceneData: SceneData = {
    version: '1.0.0',
    objects: objects.map(obj => serializeObject(obj)),
    metadata: {
      exportDate: new Date().toISOString(),
      format: 'json',
    },
  };

  return JSON.stringify(sceneData, null, 2);
}

/**
 * Серіалізує об'єкт Three.js в JSON
 */
function serializeObject(obj: CollectionElementProps): SceneObjectData {
  const mesh = obj.mesh as THREE.Mesh;
  const position = mesh.position;
  const rotation = mesh.rotation;
  const scale = mesh.scale;

  const data: SceneObjectData = {
    id: obj.id,
    name: obj.name,
    type: obj.type,
    shape: obj.shape ?? null,
    position: { x: position.x, y: position.y, z: position.z },
    rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
    scale: { x: scale.x, y: scale.y, z: scale.z },
  };

  // Додаємо інформацію про матеріал
  if (mesh.material) {
    const material = mesh.material as THREE.MeshStandardMaterial;
    if (material.color) {
      data.color = material.color.getHex();
    }
    if (material.wireframe !== undefined) {
      data.materialType = material.wireframe ? 'wireframe' : 'standard';
    } else {
      data.materialType = 'standard';
    }
  }

  // Додаємо інформацію про геометрію
  if (mesh.geometry) {
    const geometry = mesh.geometry;
    data.geometry = {
      type: geometry.type,
      parameters: getGeometryParameters(geometry),
    };
  }

  // Додаємо дочірні об'єкти
  if (obj.children && obj.children.length > 0) {
    data.children = obj.children.map(child => serializeObject(child));
  }

  return data;
}

/**
 * Отримує параметри геометрії
 */
function getGeometryParameters(geometry: THREE.BufferGeometry): Record<string, any> {
  const params: Record<string, any> = {};

  if (geometry instanceof THREE.BoxGeometry) {
    params.width = (geometry.parameters as any).width;
    params.height = (geometry.parameters as any).height;
    params.depth = (geometry.parameters as any).depth;
  } else if (geometry instanceof THREE.SphereGeometry) {
    params.radius = (geometry.parameters as any).radius;
    params.widthSegments = (geometry.parameters as any).widthSegments;
    params.heightSegments = (geometry.parameters as any).heightSegments;
  } else if (geometry instanceof THREE.CylinderGeometry) {
    params.radiusTop = (geometry.parameters as any).radiusTop;
    params.radiusBottom = (geometry.parameters as any).radiusBottom;
    params.height = (geometry.parameters as any).height;
  } else if (geometry instanceof THREE.TorusGeometry) {
    params.radius = (geometry.parameters as any).radius;
    params.tube = (geometry.parameters as any).tube;
  }

  return params;
}

/**
 * Імпортує сцену з JSON формату
 */
export function importFromJSON(json: string): SceneObjectData[] {
  try {
    const sceneData: SceneData = JSON.parse(json);
    return sceneData.objects;
  } catch (error) {
    throw new Error('Помилка при парсингу JSON файлу');
  }
}

/**
 * Створює об'єкт Three.js з серіалізованих даних
 */
export function createObjectFromData(data: SceneObjectData): THREE.Object3D {
  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.Material;

  // Створюємо геометрію
  if (data.geometry) {
    switch (data.geometry.type) {
      case 'BoxGeometry':
        geometry = new THREE.BoxGeometry(
          data.geometry.parameters.width || 1,
          data.geometry.parameters.height || 1,
          data.geometry.parameters.depth || 1
        );
        break;
      case 'SphereGeometry':
        geometry = new THREE.SphereGeometry(
          data.geometry.parameters.radius || 0.5,
          data.geometry.parameters.widthSegments || 32,
          data.geometry.parameters.heightSegments || 32
        );
        break;
      case 'CylinderGeometry':
        geometry = new THREE.CylinderGeometry(
          data.geometry.parameters.radiusTop || 0.5,
          data.geometry.parameters.radiusBottom || 0.5,
          data.geometry.parameters.height || 1
        );
        break;
      case 'TorusGeometry':
        geometry = new THREE.TorusGeometry(
          data.geometry.parameters.radius || 0.5,
          data.geometry.parameters.tube || 0.2
        );
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
  } else {
    geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  // Створюємо матеріал
  if (data.materialType === 'wireframe') {
    material = new THREE.MeshStandardMaterial({
      color: data.color || 0x00ff00,
      wireframe: true,
    });
  } else if (data.materialType === 'points') {
    material = new THREE.PointsMaterial({
      color: data.color || 0x00ff00,
      size: 0.1,
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color: data.color || 0x00ff00,
    });
  }

  // Створюємо mesh
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = data.name;
  mesh.position.set(data.position.x, data.position.y, data.position.z);
  mesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
  mesh.scale.set(data.scale.x, data.scale.y, data.scale.z);

  // Додаємо дочірні об'єкти
  if (data.children && data.children.length > 0) {
    data.children.forEach(childData => {
      const child = createObjectFromData(childData);
      mesh.add(child);
    });
  }

  return mesh;
}

/**
 * Завантажує файл як текст
 */
export function loadFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Помилка при читанні файлу'));
      }
    };
    reader.onerror = () => reject(new Error('Помилка при читанні файлу'));
    reader.readAsText(file);
  });
}

/**
 * Завантажує файл як ArrayBuffer (для бінарних форматів)
 */
export function loadFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error('Помилка при читанні файлу'));
      }
    };
    reader.onerror = () => reject(new Error('Помилка при читанні файлу'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Завантажує файл
 */
export function downloadFile(content: string | Blob, fileName: string, mimeType: string = 'application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Імпортує модель з файлу використовуючи Three.js завантажувачі
 */
export async function importModelFromFile(file: File, format: FileFormat): Promise<THREE.Object3D[]> {
  const fileUrl = URL.createObjectURL(file);
  
  try {
    switch (format) {
      case 'gltf':
      case 'glb': {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(fileUrl);
        URL.revokeObjectURL(fileUrl);
        return [gltf.scene];
      }
      
      case 'obj': {
        const loader = new OBJLoader();
        const object = await loader.loadAsync(fileUrl);
        URL.revokeObjectURL(fileUrl);
        return [object];
      }
      
      case 'stl': {
        const loader = new STLLoader();
        const geometry = await loader.loadAsync(fileUrl);
        URL.revokeObjectURL(fileUrl);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        return [mesh];
      }
      
      case 'ply': {
        const loader = new PLYLoader();
        const geometry = await loader.loadAsync(fileUrl);
        URL.revokeObjectURL(fileUrl);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        return [mesh];
      }
      
      case 'fbx': {
        const loader = new FBXLoader();
        const object = await loader.loadAsync(fileUrl);
        URL.revokeObjectURL(fileUrl);
        return [object];
      }
      
      case 'dae': {
        const loader = new ColladaLoader();
        return new Promise((resolve, reject) => {
          loader.load(
            fileUrl,
            (collada) => {
              URL.revokeObjectURL(fileUrl);
              resolve([collada.scene]);
            },
            undefined,
            (error) => {
              URL.revokeObjectURL(fileUrl);
              reject(error);
            }
          );
        });
      }
      
      case 'json': {
        const json = await loadFileAsText(file);
        const objectsData = importFromJSON(json);
        return objectsData.map(objData => createObjectFromData(objData));
      }
      
      default:
        throw new Error(`Формат ${format} не підтримується для імпорту`);
    }
  } catch (error) {
    URL.revokeObjectURL(fileUrl);
    throw error;
  }
}

/**
 * Експортує сцену в формат використовуючи Three.js експортери
 */
export async function exportSceneToFormat(
  objects: CollectionElementProps[],
  format: FileFormat,
  fileName: string
): Promise<void> {
  // Створюємо групу для експорту
  const group = new THREE.Group();
  objects.forEach(obj => {
    group.add(obj.mesh.clone());
  });

  switch (format) {
    case 'gltf':
    case 'glb': {
      const exporter = new GLTFExporter();
      const result = await new Promise<any>((resolve, reject) => {
        exporter.parse(
          group,
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Помилка при експорті GLTF'));
            }
          },
          (error) => {
            reject(error);
          },
          { binary: format === 'glb', includeCustomExtensions: true }
        );
      });
      
      if (format === 'glb') {
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        downloadFile(blob, `${fileName}.glb`, 'model/gltf-binary');
      } else {
        const json = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        downloadFile(json, `${fileName}.gltf`, 'model/gltf+json');
      }
      break;
    }
    
    case 'obj': {
      const exporter = new OBJExporter();
      const result = exporter.parse(group);
      downloadFile(result, `${fileName}.obj`, 'text/plain');
      break;
    }
    
    case 'stl': {
      const exporter = new STLExporter();
      const result = exporter.parse(group);
      downloadFile(result, `${fileName}.stl`, 'application/sla');
      break;
    }
    
    case 'ply': {
      const exporter = new PLYExporter();
      const result = exporter.parse(group, () => {}, { binary: false });
      if (result) {
        downloadFile(result, `${fileName}.ply`, 'text/plain');
      } else {
        throw new Error('Помилка при експорті PLY');
      }
      break;
    }
    
    case 'json': {
      const json = exportToJSON(objects);
      downloadFile(json, `${fileName}.json`, 'application/json');
      break;
    }
    
    case 'fbx':
    case 'dae':
    case '3mf':
    case 'amf':
      throw new Error(`Експорт в формат ${format} поки не підтримується. Використовуйте GLTF, GLB, OBJ, STL, PLY або JSON.`);
    
    default:
      throw new Error(`Формат ${format} не підтримується`);
  }
}


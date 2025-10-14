/**
 * Типи для роботи зі сценою та 3D об'єктами
 */

import * as THREE from 'three';
import { CollectionElementProps } from '@/components/UI/Collection/types';
import { TransformMode } from './common.types';

export interface SceneObject {
  id: string;
  mesh: THREE.Object3D;
  name: string;
  type: string;
  shape: string | null;
  children: SceneObject[];
}

export interface ObjectTreeNode {
  id: string;
  name: string;
  type: string;
  shape: string | null;
  children: ObjectTreeNode[];
}

export interface SceneManager {
  objects: CollectionElementProps[];
  selectedObjectId: string | null;
  isEditMode: boolean;
  transformMode: TransformMode;
  addObject: (mesh: THREE.Object3D, name?: string, type?: string) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string) => void;
  clearSelection: () => void;
  toggleEditMode: () => void;
  setTransformMode: (mode: TransformMode) => void;
  changeObjectColor: (id: string, color: number) => void;
  getTreeScene: () => ObjectTreeNode[];
}

export interface ThreeSceneProps {
  objects: CollectionElementProps[];
  selectObject: (id: string) => void;
  selectedObjectId: string | null;
  clearSelection: () => void;
  isEditMode: boolean;
  transformMode: TransformMode;
}

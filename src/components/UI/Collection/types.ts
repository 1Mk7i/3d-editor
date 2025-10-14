import * as THREE from 'three'

export type CollectionVariant = 'grid' | 'list';
export type CollectionSize = 'small' | 'medium' | 'large' | 'extraLarge';

export interface CollectionElementProps {
  id: string;
  mesh: THREE.Object3D;
  name: string;
  type: string;
  shape?: string | null;
  children?: CollectionElementProps[];
}
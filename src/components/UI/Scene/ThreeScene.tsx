'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useTheme } from '@mui/material/styles'
import { CollectionElementProps } from '@/components/UI/Collection/types'
import { SettingsData } from '@/hooks/useSettings'

type ThreeSceneProps = {
  objects: CollectionElementProps[];
  selectObject: (id: string) => void;
  selectedObjectId: string | null;
  clearSelection: () => void;
  isEditMode: boolean;
  transformMode: 'translate' | 'rotate' | 'scale';
  settings: SettingsData;
  backgroundColor?: string;
};

const SceneContent = ({ objects, selectObject, selectedObjectId, clearSelection, isEditMode, transformMode, settings, backgroundColor }: ThreeSceneProps) => {
  const { camera, gl, scene } = useThree();
  const theme = useTheme();
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    const finalColor = backgroundColor || (theme.palette as any).editor?.sceneBackground || settings.sceneBackgroundColor;
    scene.background = new THREE.Color(finalColor);
  }, [backgroundColor, theme.palette.mode, settings.sceneBackgroundColor, scene]);

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const mouseDownPos = useRef(new THREE.Vector2());

  useEffect(() => {
    if (gridHelperRef.current) scene.remove(gridHelperRef.current);
    
    if (settings.gridVisible) {
      const gridColor = (theme.palette as any).editor?.grid || 'gray';
      const gridHelper = new THREE.GridHelper(
        settings.gridSize,
        settings.gridDivisions,
        gridColor,
        theme.palette.divider
      );
      gridHelperRef.current = gridHelper;
      scene.add(gridHelper);
    }

    return () => {
      if (gridHelperRef.current) scene.remove(gridHelperRef.current);
    };
  }, [settings.gridVisible, settings.gridSize, settings.gridDivisions, scene, theme.palette.mode]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => { isDragging.current = false; mouseDownPos.current.set(e.clientX, e.clientY); };
    const handleMouseMove = (e: MouseEvent) => { if (mouseDownPos.current.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) isDragging.current = true; };
    const handleClick = (event: MouseEvent) => {
      if (isDragging.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(objects.map(obj => obj.mesh), true);
      if (intersects.length > 0) {
        const clickedObj = objects.find(obj => obj.mesh === intersects[0].object || obj.mesh.uuid === intersects[0].object.uuid);
        if (clickedObj) selectObject(clickedObj.id);
      } else { clearSelection(); }
    };

    const el = gl.domElement;
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('click', handleClick);
    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('click', handleClick);
    };
  }, [objects, selectObject, clearSelection, camera, gl]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={0.8} castShadow={settings.shadows} />
      {objects.map(obj => (
        obj.id === selectedObjectId ? (
          <TransformControls key={obj.id} object={obj.mesh} mode={isEditMode ? transformMode : 'translate'}>
            <primitive object={obj.mesh} />
          </TransformControls>
        ) : (
          <primitive key={obj.id} object={obj.mesh} />
        )
      ))}
      <OrbitControls makeDefault />
    </>
  );
};

const ThreeScene = (props: ThreeSceneProps) => {
  const theme = useTheme();
  const settingsKey = `${theme.palette.mode}-${props.settings.renderQuality}-${props.settings.shadows}`;
  
  return (
    <Canvas 
      key={settingsKey}
      shadows={props.settings.shadows}
      gl={{ antialias: props.settings.antialiasing }}
      camera={{ position: [10, 10, 10], fov: 55 }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}

export default ThreeScene;
'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
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
};

const SceneContent = ({ objects, selectObject, selectedObjectId, clearSelection, isEditMode, transformMode, settings }: ThreeSceneProps) => {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const mouseDownPos = useRef(new THREE.Vector2());
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  useEffect(() => {
    const color = new THREE.Color(settings.sceneBackgroundColor);
    scene.background = color;
  }, [settings.sceneBackgroundColor, scene]);

  useEffect(() => {
    const pixelRatio = settings.renderQuality === 'high' ? 2 : settings.renderQuality === 'medium' ? 1.5 : 1;
    gl.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
  }, [settings.renderQuality, gl]);

  useEffect(() => {
    if (!settings.antialiasing && gl) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    }
  }, [settings.antialiasing, gl]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = false;
      mouseDownPos.current.set(event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const distance = mouseDownPos.current.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
      if (distance > 5) { // Якщо переміщення більше 5 пікселів - це drag
        isDragging.current = true;
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (isDragging.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.current.setFromCamera(mouse.current, camera);
      const meshes = objects.map(obj => obj.mesh);
      const intersects = raycaster.current.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const clickedObj = objects.find(obj => 
          obj.mesh === clickedMesh || obj.mesh.uuid === clickedMesh.uuid
        );
        if (clickedObj) selectObject(clickedObj.id);
      } else {
        clearSelection();
      }
    };

    const element = gl.domElement;
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
    };
  }, [objects, selectObject, clearSelection, camera, gl]);

  useEffect(() => {
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
    }
    
    if (settings.gridVisible) {
      const gridHelper = new THREE.GridHelper(
        settings.gridSize,
        settings.gridDivisions,
        'gray',
        'lightgray'
      );
      gridHelperRef.current = gridHelper;
      scene.add(gridHelper);
    }

    return () => {
      if (gridHelperRef.current) {
        scene.remove(gridHelperRef.current);
        gridHelperRef.current = null;
      }
    };
  }, [settings.gridVisible, settings.gridSize, settings.gridDivisions, scene]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[2, 2, 2]} 
        intensity={0.8}
        castShadow={settings.shadows}
      />
      {objects.map(obj => {
        if (obj.mesh instanceof THREE.Mesh) {
          obj.mesh.castShadow = settings.shadows;
          obj.mesh.receiveShadow = settings.shadows;
        }
        
        return obj.id === selectedObjectId ? (
          <TransformControls object={obj.mesh} key={obj.id} mode={isEditMode ? transformMode : 'translate'}>
            <primitive object={obj.mesh} />
          </TransformControls>
        ) : (
          <primitive object={obj.mesh} key={obj.id} />
        );
      })}
      <OrbitControls makeDefault />
    </>
  );
};

const ThreeScene = ({ objects, selectObject, selectedObjectId, clearSelection, isEditMode, transformMode, settings }: ThreeSceneProps) => {
  const settingsKey = `${settings.sceneBackgroundColor}-${settings.gridVisible}-${settings.gridSize}-${settings.gridDivisions}-${settings.renderQuality}-${settings.shadows}-${settings.antialiasing}`;
  
  return (
    <Canvas 
      key={settingsKey}
      style={{ width: '100%', height: '100%' }}
      shadows={settings.shadows}
      gl={{ antialias: settings.antialiasing }}
      camera={{ 
        position: [10, 10, 10],
        fov: 55,
        near: 0.1,
        far: 1000
      }}
    >
      <SceneContent 
        objects={objects}
        selectObject={selectObject}
        selectedObjectId={selectedObjectId}
        clearSelection={clearSelection}
        isEditMode={isEditMode}
        transformMode={transformMode}
        settings={settings}
      />
    </Canvas>
  );
}

export default ThreeScene
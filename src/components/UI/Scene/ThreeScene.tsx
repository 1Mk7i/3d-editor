'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

type SceneObject = {
  id: string;
  mesh: THREE.Object3D;
};

type ThreeSceneProps = {
  objects: SceneObject[];
  selectObject: (id: string) => void;
  selectedObjectId: string | null;
  clearSelection: () => void;
};

const SceneContent = ({ objects, selectObject, selectedObjectId, clearSelection }: ThreeSceneProps) => {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const mouseDownPos = useRef(new THREE.Vector2());

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
      // Ігноруємо клік якщо була drag операція
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

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={0.8} />
      {objects.map(obj => (
        obj.id === selectedObjectId ? (
          <TransformControls object={obj.mesh} key={obj.id} mode="translate">
            <primitive object={obj.mesh} />
          </TransformControls>
        ) : (
          <primitive object={obj.mesh} key={obj.id} />
        )
      ))}
      <OrbitControls makeDefault />
    </>
  );
};

const ThreeScene = ({ objects, selectObject, selectedObjectId, clearSelection }: ThreeSceneProps) => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <SceneContent 
        objects={objects}
        selectObject={selectObject}
        selectedObjectId={selectedObjectId}
        clearSelection={clearSelection}
      />
    </Canvas>
  );
}

export default ThreeScene
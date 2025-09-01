'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Створення сцени
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xf3f4f6) // світло-сірий фон
    mountRef.current.appendChild(renderer.domElement)

    // Додавання куба
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x3b82f6, // синій колір
      shininess: 100 
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Додавання світла
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Позиція камери
    camera.position.z = 5

    // Анімація
    const animate = () => {
      requestAnimationFrame(animate)
      
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      
      renderer.render(scene, camera)
    }
    
    animate()

    // Обробка зміни розміру вікна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth , window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)

    // Прибирання
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div ref={mountRef} />
}

export default ThreeScene
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function SpaceBackground() {
  const { scene } = useThree()

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader()
    const cubeTexture = loader.load([
      '/textures/milkyway/dark-s_px.jpg',
      '/textures/milkyway/dark-s_nx.jpg',
      '/textures/milkyway/dark-s_py.jpg',
      '/textures/milkyway/dark-s_ny.jpg',
      '/textures/milkyway/dark-s_pz.jpg',
      '/textures/milkyway/dark-s_nz.jpg',
    ])

    cubeTexture.colorSpace = THREE.SRGBColorSpace
    scene.background = cubeTexture
    scene.environment = cubeTexture

    return () => {
      scene.background = null
      scene.environment = null
      cubeTexture.dispose()
    }
  }, [scene])

  return null
}

import { useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EquirectangularReflectionMapping, TextureLoader, SRGBColorSpace } from 'three'

export function SunsetEnvironment() {
  const texture = useLoader(TextureLoader, '/textures/sunset-panorama.webp')
  texture.colorSpace = SRGBColorSpace
  texture.mapping = EquirectangularReflectionMapping

  return (
    <Environment
      map={texture}
      background
      backgroundIntensity={0.35}
      environmentIntensity={0.65}
      backgroundRotation={[0, Math.PI / 2, 0]}
      environmentRotation={[0, Math.PI / 2, 0]}
    />
  )
}

import { useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { EquirectangularReflectionMapping } from 'three'
import sunsetUrl from '../../industrial_sunset_puresky_4k.exr?url'

export function SunsetEnvironment() {
  const texture = useLoader(EXRLoader, sunsetUrl)
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

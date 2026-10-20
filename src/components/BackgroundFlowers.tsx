import { useLayoutEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type Kind = 1 | 2
const specs = {
  1: { count: 920, height: 0.58 },
  2: { count: 520, height: 0.47 },
} as const

function FlowerInstances({ kind }: { kind: Kind }) {
  const { scene } = useGLTF('/models/flower' + kind + '.glb')
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([])
  const { meshes, transform, locations } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(scene)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const height = Math.max(size.y, 0.001)
    const normalize = new THREE.Matrix4().makeScale(1 / height, 1 / height, 1 / height)
      .multiply(new THREE.Matrix4().makeTranslation(-center.x, -bounds.min.y, -center.z))
    const meshes: THREE.Mesh[] = []
    scene.traverse(obj => { if (obj instanceof THREE.Mesh) meshes.push(obj) })
    let seed = 20261020 + kind * 103
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
    // Full 360-degree meadow. Rear of the starting camera (z > 33)
    // has no pathway, so it is planted across the entire width.
    const clusters = Array.from({ length: 150 }, (_, i) => {
      const rear = i % 2 === 0
      return {
        x: (random() - 0.5) * 64,
        z: rear ? 33 + random() * 67 : -47 + random() * 79,
        radiusX: 2.0 + random() * 5.0,
        radiusZ: 2.5 + random() * 6.0,
      }
    })
    const locations = Array.from({ length: specs[kind].count }, () => {
      const rear = random() < 0.48
      const roll = random()
      let x: number
      let z: number
      if (roll < 0.30) {
        // Dense garden borders up front, full-width flowers behind the camera.
        x = rear ? (random() - 0.5) * 64 : (random() > 0.5 ? 1 : -1) * (2.65 + Math.pow(random(), 1.3) * 12)
        z = rear ? 33 + random() * 67 : -47 + random() * 79
      } else if (roll < 0.89) {
        const patch = clusters[Math.floor(random() * clusters.length)]
        const angle = random() * Math.PI * 2
        const radius = Math.sqrt(random())
        x = patch.x + Math.cos(angle) * radius * patch.radiusX
        z = patch.z + Math.sin(angle) * radius * patch.radiusZ
      } else {
        x = (random() - 0.5) * 68
        z = -47 + random() * 147
      }
      // Only protect the actual forward paved path; rear remains full.
      if (z >= -17 && z <= 31 && Math.abs(x) < 2.65) {
        x = (x < 0 ? -1 : 1) * (2.65 + random() * 1.0)
      }
      return { x, z, angle: random() * Math.PI * 2, vary: 0.74 + random() * 0.7 }
    })
    return { meshes, transform: normalize, locations }
  }, [scene, kind])

  useLayoutEffect(() => {
    const obj = new THREE.Object3D()
    const m = new THREE.Matrix4()
    meshes.forEach((source, meshIndex) => {
      const instance = meshRefs.current[meshIndex]
      if (!instance) return
      locations.forEach((loc, i) => {
        obj.position.set(loc.x, 0.025, loc.z)
        obj.rotation.set(0, loc.angle, 0)
        obj.scale.setScalar(specs[kind].height * loc.vary)
        obj.updateMatrix()
        m.copy(obj.matrix).multiply(transform).multiply(source.matrixWorld)
        instance.setMatrixAt(i, m)
      })
      instance.instanceMatrix.needsUpdate = true
      instance.computeBoundingSphere()
    })
  }, [kind, meshes, locations, transform])

  return <group>{meshes.map((mesh, i) =>
    <instancedMesh key={mesh.uuid} ref={node => { meshRefs.current[i] = node }}
      args={[mesh.geometry, mesh.material, locations.length]} dispose={null} />
  )}</group>
}

export function BackgroundFlowers() {
  return <group>
    <FlowerInstances kind={1} />
    <FlowerInstances kind={2} />
  </group>
}
useGLTF.preload('/models/flower1.glb')
useGLTF.preload('/models/flower2.glb')

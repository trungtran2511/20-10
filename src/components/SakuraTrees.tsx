import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import treeUrl from '../../sakura_tree_01_-_low_poly_model.glb?url'

function TreePart({
  source,
  normalization,
  timeUniform
}: {
  source: THREE.Mesh
  normalization: THREE.Matrix4
  timeUniform: { value: number }
}) {
  const ref = useRef<THREE.InstancedMesh>(null)

  const barkTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256; canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#76513b'; ctx.fillRect(0, 0, 256, 512)
    let seed = 721
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    for (let i = 0; i < 1550; i++) {
      const x = rand() * 256, y = rand() * 512
      ctx.strokeStyle = rand() > .48 ? 'rgba(205,164,121,.24)' : 'rgba(36,22,17,.30)'
      ctx.lineWidth = .4 + rand() * 2.3
      ctx.beginPath(); ctx.moveTo(x,y)
      ctx.bezierCurveTo(x+rand()*5-2,y+12,x+rand()*8-4,y+30,x+rand()*7-3,y+12+rand()*90)
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = 8
    return texture
  }, [])

  const materials = useMemo(() => {
    const isBark = source.name.toLowerCase().includes('bark')
    const isBlossom = !isBark

    const prepare = (original: THREE.Material) => {
      const material = (original as THREE.MeshStandardMaterial).clone()
      
      if (isBlossom) {
        // Blossom cards need crisp cutout alpha & warm sunset glow
        material.transparent = false
        material.alphaTest = 0.16
        material.depthWrite = true
        material.roughness = 0.78
        material.emissive = new THREE.Color('#f472b6')
        material.emissiveIntensity = 0.10
        material.side = THREE.DoubleSide

        // Vertex shader wind sway & high-frequency leaf flutter ONLY on leaves
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = timeUniform
          shader.vertexShader = `
            uniform float uTime;
          ` + shader.vertexShader

          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            // Z is vertical axis in local geometry (0 to ~38)
            float h = clamp(position.z / 38.0, 0.0, 1.0);
            float swayX = sin(uTime * 1.5 + position.x * 0.12 + position.y * 0.12) * (h * h) * 0.12;
            float swayY = cos(uTime * 1.2 + position.x * 0.1) * (h * h) * 0.10;
            float flutter = sin(uTime * 4.5 + position.x * 0.9 + position.y * 0.9) * 0.025 * h;
            transformed.x += swayX + flutter;
            transformed.y += swayY + flutter * 0.7;
            `
          )
        }
      } else {
        // Tree trunk & thick branches: Natural realistic dark bark, completely anchored (no wind sway)
        material.map = barkTexture
        material.color.set('#c6a68d')
        material.normalMap = null
        material.roughness = 0.96
        material.metalness = 0.02
        material.emissive = new THREE.Color(0, 0, 0)
        material.emissiveIntensity = 0
        // No vertex sway shader: trunk & branches stay completely static and solid
      }
      return material
    }

    return Array.isArray(source.material) ? source.material.map(prepare) : prepare(source.material)
  }, [source, timeUniform, barkTexture])

  useLayoutEffect(() => {
    const placement = new THREE.Object3D()
    const matrix = new THREE.Matrix4()
    let i = 0
    for (const z of [25, 18, 11, 4, -3, -10]) {
      for (const side of [-1, 1]) {
        placement.position.set(side * 5.1, 0, z + (side === 1 ? 0.5 : 0))
        placement.rotation.set(0, i * 1.37, 0)
        // Four silhouette variations from one shared GLB; no extra draw calls.
        const profiles = [
          [1.02, 0.94, 1.06],
          [0.90, 1.09, 0.92],
          [1.12, 0.91, 0.98],
          [0.95, 1.03, 1.12],
        ]
        const profile = profiles[(i + Math.floor(i / 2)) % profiles.length]
        const base = 0.91 + (i % 3) * 0.045
        placement.scale.set(base * profile[0], base * profile[1], base * profile[2])
        placement.updateMatrix()
        matrix.copy(placement.matrix).multiply(normalization).multiply(source.matrixWorld)
        ref.current!.setMatrixAt(i++, matrix)
      }
    }
    ref.current!.instanceMatrix.needsUpdate = true
    ref.current!.computeBoundingSphere()
  }, [normalization, source])

  return <instancedMesh ref={ref} args={[source.geometry, materials, 12]} dispose={null} />
}

export function SakuraTrees() {
  const { scene } = useGLTF(treeUrl)
  const timeUniform = useRef({ value: 0 })

  useFrame((state) => {
    timeUniform.current.value = state.clock.getElapsedTime()
  })

  const { meshes, normalization } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(scene)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const scale = 7.6 / Math.max(size.y, 0.001)
    const normalization = new THREE.Matrix4().makeScale(scale, scale, scale)
      .multiply(new THREE.Matrix4().makeTranslation(-center.x, -bounds.min.y, -center.z))
    const meshes: THREE.Mesh[] = []
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) meshes.push(object)
    })
    return { meshes, normalization }
  }, [scene])

  return (
    <group>
      {meshes.map(mesh => (
        <TreePart
          key={mesh.uuid}
          source={mesh}
          normalization={normalization}
          timeUniform={timeUniform.current}
        />
      ))}
    </group>
  )
}

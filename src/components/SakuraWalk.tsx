import { useLayoutEffect, useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { SakuraTrees } from './SakuraTrees'
import { SAKURA_TINTS } from '../utils/sakuraPetals'
import * as THREE from 'three'

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

// Procedural ground flower blossom texture (5 notched petals + golden stamens)
function createBlossomTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.translate(64, 64)

  for (let i = 0; i < 5; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI * 2) / 5)
    const gradient = ctx.createLinearGradient(0, 0, 0, -56)
    gradient.addColorStop(0, '#be185d')
    gradient.addColorStop(0.4, '#f472b6')
    gradient.addColorStop(0.85, '#fbcfe8')
    gradient.addColorStop(1, '#fff1f2')
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.moveTo(0, 3)
    ctx.bezierCurveTo(-35, -17, -28, -58, -7, -53)
    ctx.lineTo(0, -46)
    ctx.lineTo(7, -53)
    ctx.bezierCurveTo(28, -58, 35, -17, 0, 3)
    ctx.fill()
    ctx.restore()
  }

  // Golden stamen dots
  ctx.fillStyle = '#ffdfac'
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI * 2) / 10
    ctx.beginPath()
    ctx.arc(Math.cos(a) * 9, Math.sin(a) * 9, 2.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Center core
  ctx.fillStyle = '#f43f5e'
  ctx.beginPath()
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const VARIANT_COUNT = 8
const PETALS_PER_VARIANT = 38 // 304 softly drifting petals; shared instanced geometry
const GROUND_PER_VARIANT = 120 // 960 ground single petals total

interface FallingPetal {
  x: number
  y: number
  z: number
  speed: number
  rotSpeed: number
  phase: number
  scale: number
  swayFreq: number
  swayAmp: number
  color: THREE.Color
}

export function SakuraWalk() {
  const reduced = useReducedMotion()
  const petalTime = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Individually sculpted curved sakura petals, avoiding atlas UV artifacts.
  const geometries = useMemo(() => Array.from({ length: VARIANT_COUNT }, (_, idx) => {
    const w = 0.105 + (idx % 4) * 0.008
    const h = 0.17 + (idx % 3) * 0.012
    const shape = new THREE.Shape()
    shape.moveTo(0, -h / 2)
    shape.bezierCurveTo(-w * .85, -h * .25, -w * 1.15, h * .15, -w * .55, h * .42)
    shape.bezierCurveTo(-w * .26, h * .56, -w * .1, h * .43, 0, h * .39)
    shape.bezierCurveTo(w * .1, h * .43, w * .26, h * .56, w * .55, h * .42)
    shape.bezierCurveTo(w * 1.15, h * .15, w * .85, -h * .25, 0, -h / 2)
    return new THREE.ShapeGeometry(shape, 12)
  }), [])

  const fallingMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#fff0f4',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.83,
    depthWrite: false
  }), [])

  const groundTexture = useMemo(createBlossomTexture, [])

  const groundPetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffb7cf',
    side: THREE.DoubleSide,
    roughness: 0.7,
    emissive: '#f43f5e',
    emissiveIntensity: 0.18
  }), [])

  // Refs for 8 falling instanced meshes
  const fallingRefs = useRef<(THREE.InstancedMesh | null)[]>([])
  // Refs for 8 ground single-petal instanced meshes
  const groundRefs = useRef<(THREE.InstancedMesh | null)[]>([])
  // Ref for whole flower blossoms on ground
  const wholeFlowersRef = useRef<THREE.InstancedMesh>(null)

  // Simulation and placement data
  const data = useMemo(() => {
    const random = seeded(20102026)

    // Falling petals divided into 8 variants
    const fallingGroups: FallingPetal[][] = Array.from({ length: VARIANT_COUNT }, () => [])

    for (let v = 0; v < VARIANT_COUNT; v++) {
      for (let i = 0; i < PETALS_PER_VARIANT; i++) {
        fallingGroups[v].push({
          x: (random() - 0.5) * 14.0,
          y: random() * 9.5,
          z: random() * 45 - 13.5,
          speed: 0.18 + random() * 0.32,
          rotSpeed: 0.24 + random() * 0.72,
          phase: random() * Math.PI * 2,
          scale: 0.62 + random() * 0.64,
          swayFreq: 0.52 + random() * 0.60,
          swayAmp: 0.26 + random() * 0.42,
          color: new THREE.Color(['#ffccd9', '#ffe0e9', '#fff0f3', '#f7b3cc'][Math.floor(random() * 4)])
        })
      }
    }

    // Ground single petals: 120 per variant = 960 single petals
    const groundGroups: { matrices: THREE.Matrix4[]; colors: THREE.Color[] }[] = Array.from(
      { length: VARIANT_COUNT },
      () => ({ matrices: [], colors: [] })
    )

    const obj = new THREE.Object3D()
    for (let v = 0; v < VARIANT_COUNT; v++) {
      for (let i = 0; i < GROUND_PER_VARIANT; i++) {
        const rx = (random() - 0.5) * 12.8
        const rz = random() * 45 - 13.5
        const ry = 0.038 + random() * 0.012

        obj.position.set(rx, ry, rz)
        // Resting flat with slight organic tilt
        obj.rotation.set(
          -Math.PI / 2 + (random() - 0.5) * 0.2,
          (random() - 0.5) * 0.2,
          random() * Math.PI * 2
        )
        obj.scale.setScalar(0.75 + random() * 0.45)
        obj.updateMatrix()

        groundGroups[v].matrices.push(obj.matrix.clone())
        groundGroups[v].colors.push(SAKURA_TINTS[Math.floor(random() * SAKURA_TINTS.length)])
      }
    }

    // Whole flower blossoms on path edges (220 blossoms)
    const wholeBlooms: THREE.Matrix4[] = []
    const wholeColors: THREE.Color[] = []
    for (let i = 0; i < 220; i++) {
      const rx = (random() - 0.5) * 11.5
      obj.position.set(rx, 0.036 + random() * 0.012, random() * 43 - 12.5)
      obj.rotation.set(-Math.PI / 2, 0, random() * Math.PI * 2)
      obj.scale.setScalar(0.065 + random() * 0.08)
      obj.updateMatrix()
      wholeBlooms.push(obj.matrix.clone())
      wholeColors.push(random() > 0.4 ? new THREE.Color('#ffd0e3') : new THREE.Color('#ffe4ec'))
    }

    return { fallingGroups, groundGroups, wholeBlooms, wholeColors }
  }, [])

  // Initialize instances
  useLayoutEffect(() => {
    // Falling instances colors
    data.fallingGroups.forEach((group, v) => {
      const mesh = fallingRefs.current[v]
      if (!mesh) return
      group.forEach((p, i) => mesh.setColorAt(i, p.color))
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    })

    // Ground single petals
    data.groundGroups.forEach((group, v) => {
      const mesh = groundRefs.current[v]
      if (!mesh) return
      group.matrices.forEach((m, i) => {
        mesh.setMatrixAt(i, m)
        mesh.setColorAt(i, group.colors[i])
      })
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      mesh.computeBoundingSphere()
    })

    // Whole flowers
    if (wholeFlowersRef.current) {
      data.wholeBlooms.forEach((m, i) => {
        wholeFlowersRef.current!.setMatrixAt(i, m)
        wholeFlowersRef.current!.setColorAt(i, data.wholeColors[i])
      })
      wholeFlowersRef.current.instanceMatrix.needsUpdate = true
      if (wholeFlowersRef.current.instanceColor) wholeFlowersRef.current.instanceColor.needsUpdate = true
      wholeFlowersRef.current.computeBoundingSphere()
    }
  }, [data])

  useEffect(() => {
    return () => {
      fallingMaterial.dispose()
      groundPetalMaterial.dispose()
      groundTexture.dispose()
      geometries.forEach(g => g.dispose())
    }
  }, [fallingMaterial, groundPetalMaterial, groundTexture, geometries])

  // Aerodynamic falling physics loop
  useFrame((_, delta) => {
    if (!reduced) petalTime.current += Math.min(delta, 0.05)
    const t = petalTime.current

    data.fallingGroups.forEach((group, v) => {
      const mesh = fallingRefs.current[v]
      if (!mesh) return

      group.forEach((p, i) => {
        // Seamless looping fall
        const posY = ((p.y - t * p.speed) % 9.5 + 9.5) % 9.5 + 0.06

        // Aerodynamic swaying & drifting
        const swayX = Math.sin(t * p.swayFreq + p.phase) * p.swayAmp
        const driftZ = Math.cos(t * (p.swayFreq * 0.7) + p.phase) * (p.swayAmp * 0.5) - (t * 0.06) % 2.5
        let posX = p.x + swayX
        let posZ = p.z + driftZ

        // Fade/scale out smoothly near camera lens (z = 28.5)
        const camDist = Math.hypot(posX, posZ - 28.5)
        let scale = p.scale
        if (camDist < 2.5) {
          scale *= Math.max(0.001, (camDist - 0.7) / 1.8)
        }

        dummy.position.set(posX, posY, posZ)

        // Fluttering pitch, rolling wobble, lazy yaw
        const pitch = Math.sin(t * 1.30 + p.phase) * 0.52 + Math.PI * 0.5
        const yaw = t * p.rotSpeed + p.phase
        const roll = Math.cos(t * 1.18 + p.phase) * 0.34
        dummy.rotation.set(pitch, yaw, roll)

        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })

      mesh.instanceMatrix.needsUpdate = true
    })
  })

  return (
    <group>
      {/* 3D Sakura Trees */}
      <SakuraTrees />

      {/* Ground Carpet: 8 Variants of single fallen sakura petals from 2cfe4ec598247f1aafa06d4560ed570c.png */}
      {geometries.map((geom, v) => (
        <instancedMesh
          key={`ground-variant-${v}`}
          ref={el => { groundRefs.current[v] = el }}
          args={[geom, groundPetalMaterial, data.groundGroups[v].matrices.length]}
        />
      ))}

      {/* Ground Carpet: Whole blossoms scattered on path */}
      <instancedMesh
        ref={wholeFlowersRef}
        args={[undefined, undefined, data.wholeBlooms.length]}
      >
        <planeGeometry />
        <meshStandardMaterial
          map={groundTexture}
          alphaTest={0.4}
          side={THREE.DoubleSide}
          roughness={0.85}
          emissive="#bb6381"
          emissiveIntensity={0.22}
        />
      </instancedMesh>

      {/* Falling Sakura Petals: 8 unique 3D curved variants from 2cfe4ec598247f1aafa06d4560ed570c.png */}
      {geometries.map((geom, v) => (
        <instancedMesh
          key={`falling-variant-${v}`}
          ref={el => { fallingRefs.current[v] = el }}
          args={[geom, fallingMaterial, PETALS_PER_VARIANT]}
          frustumCulled={false}
        />
      ))}
    </group>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

export function SakuraGlowMotes({ count = 110 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const reduced = useReducedMotion()

  const motes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: 0.5 + Math.random() * 6.5,
      z: (Math.random() - 0.5) * 44 + 6,
      baseY: 0.5 + Math.random() * 6.5,
      speedY: 0.15 + Math.random() * 0.25,
      speedX: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.045
    }))
  }, [count])

  // Sparkle texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.3, 'rgba(254, 215, 170, 0.9)')
    grad.addColorStop(0.65, 'rgba(244, 114, 182, 0.4)')
    grad.addColorStop(1, 'rgba(244, 114, 182, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    motes.forEach((m, i) => {
      if (!reduced) {
        m.y = m.baseY + Math.sin(t * m.speedY + m.phase) * 0.6
        m.x += Math.sin(t * 0.4 + m.phase) * 0.005
      }
      dummy.position.set(m.x, m.y, m.z)
      const pulse = Math.sin(t * 2.5 + m.phase) * 0.35 + 0.65
      dummy.scale.setScalar(m.scale * pulse)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

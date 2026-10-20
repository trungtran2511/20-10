import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Individual Sculpted 3D Cherry Blossom (Bông hoa đào 3D cận cảnh chi tiết)
function DetailedBlossom({
  position,
  rotation,
  scale = 1
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}) {
  const petals = useMemo(() => {
    return [0, 72, 144, 216, 288].map(ang => (ang * Math.PI) / 180)
  }, [])

  const stamens = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2
      const r = 0.04 + Math.random() * 0.02
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h: 0.06 + Math.random() * 0.03
      }
    })
  }, [])

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)} scale={scale}>
      {/* 5 Petals */}
      {petals.map((angle, i) => (
        <group key={i} rotation={[0.2, angle, 0.15]}>
          <mesh position={[0, 0.04, 0.07]} rotation={[-0.35, 0, 0]}>
            <coneGeometry args={[0.07, 0.14, 5, 1, true]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ffb3cf' : '#ffd1e2'}
              emissive="#e11d48"
              emissiveIntensity={0.25}
              roughness={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
              transparent
              opacity={0.96}
            />
          </mesh>
        </group>
      ))}

      {/* Central Pistil Core */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#f43f5e" emissive="#be123c" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>

      {/* Golden Stamens */}
      {stamens.map((s, idx) => (
        <mesh key={idx} position={[s.x, s.h * 0.5, s.z]}>
          <cylinderGeometry args={[0.003, 0.003, s.h, 4]} />
          <meshBasicMaterial color="#fef08a" />
          <mesh position={[0, s.h * 0.5, 0]}>
            <sphereGeometry args={[0.007, 5, 5]} />
            <meshBasicMaterial color="#fde047" />
          </mesh>
        </mesh>
      ))}

      {/* Calyx (Đài hoa) */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.045, 0.05, 5]} />
        <meshStandardMaterial color="#4c0519" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Sculpted Flower Bud (Nụ hoa đào chúm chím)
function BlossomBud({
  position,
  rotation,
  scale = 1
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} rotation={new THREE.Euler(...rotation)} scale={scale}>
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#be123c"
          emissiveIntensity={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, -0.01, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.03, 0.04, 5]} />
        <meshStandardMaterial color="#4c0519" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Hero Foreground Cherry Blossom Branch (Nhành hoa đào tiền cảnh vươn vào khung hình)
export function HeroSakuraBranch() {
  const branchRef = useRef<THREE.Group>(null)

  // Construct organic curved branch geometry using a CatmullRomCurve
  const { branchGeometry, subBranchGeometry } = useMemo(() => {
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.2, 0.8, -0.4),
      new THREE.Vector3(1.4, 0.5, -0.1),
      new THREE.Vector3(0.6, 0.1, 0.1),
      new THREE.Vector3(-0.3, -0.25, 0.2),
      new THREE.Vector3(-1.1, -0.5, 0.05)
    ])
    const branchGeom = new THREE.TubeGeometry(mainCurve, 24, 0.035, 6, false)

    const subCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.7, 0.15, 0.05),
      new THREE.Vector3(0.2, 0.35, -0.1),
      new THREE.Vector3(-0.2, 0.5, -0.2)
    ])
    const subGeom = new THREE.TubeGeometry(subCurve, 16, 0.02, 5, false)

    return { branchGeometry: branchGeom, subBranchGeometry: subGeom }
  }, [])

  // Gentle wind sway animation
  useFrame((state) => {
    if (!branchRef.current) return
    const t = state.clock.getElapsedTime()
    branchRef.current.rotation.z = 0.15 + Math.sin(t * 0.8) * 0.025
    branchRef.current.rotation.x = -0.2 + Math.cos(t * 0.6) * 0.02
    branchRef.current.position.y = 3.9 + Math.sin(t * 0.9) * 0.015
  })

  return (
    <group
      ref={branchRef}
      position={[2.4, 3.9, 27.2]}
      rotation={[-0.2, -0.4, 0.15]}
    >
      {/* Wood Materials */}
      <mesh geometry={branchGeometry}>
        <meshStandardMaterial color="#3b1d22" roughness={0.85} />
      </mesh>
      <mesh geometry={subBranchGeometry}>
        <meshStandardMaterial color="#3b1d22" roughness={0.85} />
      </mesh>

      {/* Blossoms along the main branch */}
      <DetailedBlossom position={[-1.1, -0.5, 0.05]} rotation={[0.4, 0.3, -0.2]} scale={1.15} />
      <DetailedBlossom position={[-0.7, -0.38, 0.12]} rotation={[-0.3, 0.6, 0.4]} scale={1.05} />
      <DetailedBlossom position={[-0.25, -0.23, 0.22]} rotation={[0.5, -0.4, 0.1]} scale={1.25} />
      <DetailedBlossom position={[0.2, -0.05, 0.18]} rotation={[-0.2, -0.5, -0.3]} scale={1.1} />
      <DetailedBlossom position={[0.65, 0.12, 0.1]} rotation={[0.6, 0.2, 0.3]} scale={1.2} />
      <DetailedBlossom position={[1.2, 0.42, -0.05]} rotation={[-0.4, 0.5, -0.2]} scale={1.1} />

      {/* Blossoms along the upper sub-branch */}
      <DetailedBlossom position={[0.3, 0.3, -0.06]} rotation={[0.3, -0.7, 0.5]} scale={0.95} />
      <DetailedBlossom position={[-0.1, 0.46, -0.18]} rotation={[-0.5, 0.4, -0.4]} scale={1.0} />

      {/* Buds */}
      <BlossomBud position={[-1.25, -0.58, 0.02]} rotation={[0.6, 0.4, 0]} scale={1.1} />
      <BlossomBud position={[-0.28, 0.55, -0.24]} rotation={[-0.3, 0.2, -0.5]} scale={0.9} />
      <BlossomBud position={[0.85, 0.28, 0.05]} rotation={[0.8, -0.3, 0.2]} scale={0.85} />
    </group>
  )
}

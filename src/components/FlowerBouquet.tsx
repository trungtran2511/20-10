import { useMemo } from 'react'
import * as THREE from 'three'

interface FlowerBouquetProps {
  position: [number, number, number]
  scale?: number
}

// Sculpted Individual 3D Rose Flower (Bông Hoa Hồng 3D Tinh Xảo)
function RoseFlower({ position, rotation, scale = 1, color = "#f43f5e" }: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  color?: string
}) {
  return (
    <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined} scale={scale}>
      {/* Central Spiral Rose Bud */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.1, 0.22, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Inner Tier Petals */}
      <mesh position={[0, 0.08, 0]} rotation={[0.2, 0.5, 0]}>
        <dodecahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          color="#fb7185"
          emissive="#e11d48"
          emissiveIntensity={0.4}
          roughness={0.35}
        />
      </mesh>
      {/* Outer Flaring Petals */}
      <mesh position={[0, 0.04, 0]} rotation={[-0.2, 1.2, 0.3]}>
        <dodecahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          color="#fda4af"
          roughness={0.4}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Green Calyx Base */}
      <mesh position={[0, -0.06, 0]}>
        <coneGeometry args={[0.14, 0.1, 6]} />
        <meshStandardMaterial color="#064e3b" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Sculpted Daisy / Chrysanthemum Flower (Hoa Cúc Trắng Nhị Vàng)
function DaisyFlower({ position, rotation, scale = 1 }: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const petals = useMemo(() => Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12), [])

  return (
    <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined} scale={scale}>
      {/* Yellow Golden Disc Center */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      {/* Radial White Petals */}
      {petals.map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0]}
          rotation={[0, 0, angle]}
        >
          <planeGeometry args={[0.13, 0.05]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fef3c7"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

export function FlowerBouquet({ position, scale = 1 }: FlowerBouquetProps) {
  return (
    <group position={position} scale={scale}>
      {/* Hidden Warm Rose Point Light inside the bouquet to illuminate petals from within */}
      <pointLight color="#f43f5e" intensity={1.4} distance={3.2} position={[0, 0.25, 0]} />

      {/* Hero Blooming Roses Cluster */}
      <RoseFlower position={[0, 0.35, 0]} scale={1.2} color="#e11d48" />
      <RoseFlower position={[-0.26, 0.24, 0.16]} rotation={[0.3, -0.4, -0.3]} scale={1.05} color="#f43f5e" />
      <RoseFlower position={[0.26, 0.24, 0.16]} rotation={[0.3, 0.4, 0.3]} scale={1.05} color="#fb7185" />
      <RoseFlower position={[-0.2, 0.26, -0.22]} rotation={[-0.4, -0.5, 0]} scale={0.95} color="#f472b6" />
      <RoseFlower position={[0.2, 0.26, -0.22]} rotation={[-0.4, 0.5, 0]} scale={0.95} color="#ec4899" />

      {/* White / Gold Chrysanthemums Interspersed */}
      <DaisyFlower position={[0, 0.16, 0.32]} rotation={[0.6, 0, 0]} scale={1.1} />
      <DaisyFlower position={[-0.32, 0.14, -0.05]} rotation={[-0.3, -0.8, -0.4]} scale={0.95} />
      <DaisyFlower position={[0.32, 0.14, -0.05]} rotation={[-0.3, 0.8, 0.4]} scale={0.95} />

      {/* Decorative Emerald Foliage Wreath at Base */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 12]} />
        <meshStandardMaterial color="#064e3b" roughness={0.7} />
      </mesh>
    </group>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'
import { FlowerBouquet } from './FlowerBouquet'

interface PillarColumnProps {
  position: [number, number, number]
  height?: number
  hasBouquet?: boolean
  hasLampOrb?: boolean
  scale?: number
}

export function PillarColumn({
  position,
  height = 5.4,
  hasBouquet = true,
  hasLampOrb = false,
  scale = 1
}: PillarColumnProps) {
  // Generate 18 classical vertical flutes around the column shaft
  const flutes = useMemo(() => {
    const list: { angle: number; x: number; z: number }[] = []
    const count = 18
    const r = 0.38
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      list.push({
        angle,
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r
      })
    }
    return list
  }, [])

  return (
    <group position={position} scale={scale}>
      {/* ================= ATTIC MARBLE PLINTH & GOLDEN BASE ================= */}
      {/* Lower Square Plinth */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.4, 1.3]} />
        <meshStandardMaterial
          color="#101715"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      {/* Gold Plinth Bevel Trim */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.2, 0.06, 1.2]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.98}
          roughness={0.1}
          emissive="#b45309"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Lower Torus Ring */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.14, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.98}
          roughness={0.1}
          emissive="#b45309"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Middle Concave Scotia */}
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.48, 0.54, 0.08, 32]} />
        <meshStandardMaterial color="#101715" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Upper Torus Ring */}
      <mesh position={[0, 0.71, 0]}>
        <cylinderGeometry args={[0.5, 0.46, 0.08, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.98}
          roughness={0.1}
          emissive="#b45309"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* ================= FLUTED COLUMN SHAFT (Thân Cột Cẩm Thạch Khía Rãnh Cổ Điển) ================= */}
      {/* Main Core Cylinder */}
      <mesh position={[0, height / 2 + 0.75, 0]}>
        <cylinderGeometry args={[0.36, 0.42, height, 32]} />
        <meshStandardMaterial
          color="#121a17"
          metalness={0.75}
          roughness={0.14}
          emissive="#1e2a26"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 18 Vertical Classical Flutes (Rãnh khía kiến trúc La Mã bắt bóng specular) */}
      <group position={[0, height / 2 + 0.75, 0]}>
        {flutes.map((f, idx) => (
          <mesh key={idx} position={[f.x, 0, f.z]}>
            <cylinderGeometry args={[0.025, 0.028, height - 0.1, 8]} />
            <meshStandardMaterial
              color="#0d1412"
              metalness={0.8}
              roughness={0.12}
            />
          </mesh>
        ))}
      </group>

      {/* ================= CORINTHIAN GOLDEN CAPITAL (Đầu Cột Hoa Văn Vàng Ròng) ================= */}
      <group position={[0, height + 0.75, 0]}>
        {/* Astragal Neck Ring */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.44, 0.38, 0.1, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.98}
            roughness={0.1}
            emissive="#b45309"
            emissiveIntensity={0.45}
          />
        </mesh>
        {/* Bell-shaped Capital Core with Acanthus relief */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.62, 0.44, 0.24, 32]} />
          <meshStandardMaterial
            color="#fde047"
            metalness={0.98}
            roughness={0.1}
            emissive="#ca8a04"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* 4 Corner Volutes (Cuộn xoắn ốc Corinthian mạ vàng) */}
        {[
          [-0.45, 0.28, -0.45],
          [0.45, 0.28, -0.45],
          [-0.45, 0.28, 0.45],
          [0.45, 0.28, 0.45]
        ].map((vPos, i) => (
          <mesh key={`volute-${i}`} position={vPos as [number, number, number]}>
            <torusGeometry args={[0.1, 0.035, 12, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.98}
              roughness={0.1}
              emissive="#b45309"
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
        {/* Abacus Top Plate */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[1.3, 0.1, 1.3]} />
          <meshStandardMaterial
            color="#fde047"
            metalness={0.98}
            roughness={0.1}
            emissive="#b45309"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* ================= FLOWER BOUQUET OR WARM LAMP ON TOP ================= */}
      {hasBouquet && (
        <FlowerBouquet position={[0, height + 1.22, 0]} scale={1.25} />
      )}

      {hasLampOrb && (
        <group position={[0, height + 1.05, 0]}>
          <mesh>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#f59e0b"
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
          <pointLight color="#fde047" intensity={1.2} distance={4} />
        </group>
      )}
    </group>
  )
}

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'
import { soundManager } from '../utils/audio'
import { PillarColumn } from './PillarColumn'
import { FlowerBouquet } from './FlowerBouquet'
import { createCarpetTexture } from '../utils/textures'

interface GrandGatewayProps {
  onEnter: () => void
  isCurrentStation: boolean
}

// Sculpted Elongated Magic Crystal Core (Viên Pha Lê Ma Thuật Đa Diện Độc Bản)
function MagicCrystalCore({ hovered }: { hovered: boolean }) {
  const crystalRef = useRef<THREE.Group>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.75
      crystalRef.current.rotation.z = Math.sin(t * 1.2) * 0.1
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 1.5
      const s = 1.0 + Math.sin(t * 3) * 0.1
      innerCoreRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group ref={crystalRef} scale={hovered ? 1.2 : 1.0}>
      {/* Internal Pulsing Energy Core */}
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[0.35]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <pointLight color="#f43f5e" intensity={hovered ? 2.5 : 1.4} distance={4} />

      {/* Main Elongated Faceted Crystal Shard (Thấu Kính Tinh Thể Huyền Ảo) */}
      <mesh>
        <cylinderGeometry args={[0, 0.42, 1.6, 6]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#f472b6"
          emissiveIntensity={hovered ? 1.2 : 0.7}
          roughness={0.08}
          transmission={0.9}
          thickness={1.4}
          ior={1.55}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Lower Inverted Crystal Tip */}
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0, 0.42, 0.6, 6]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#f472b6"
          emissiveIntensity={hovered ? 1.2 : 0.7}
          roughness={0.08}
          transmission={0.9}
          thickness={1.4}
          ior={1.55}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 3 Orbiting Satellite Crystal Shards */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
        <group key={`sat-${idx}`} rotation={[0, angle, 0.3]}>
          <mesh position={[0.75, Math.sin(idx) * 0.2, 0]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fde047"
              emissiveIntensity={1.2}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Golden Wire Geometric Cage */}
      <mesh>
        <octahedronGeometry args={[0.65]} />
        <meshBasicMaterial color="#fbbf24" wireframe />
      </mesh>
    </group>
  )
}

export function GrandGateway({ onEnter }: GrandGatewayProps) {
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef<THREE.Group>(null)

  const carpetTexture = useMemo(() => createCarpetTexture(), [])

  // Floating spherical lamps along the walkway matching reference image_1.png
  const lampPedestals = useMemo(() => [
    { pos: [-2.5, 0, 22] as [number, number, number], color: "#fb7185" },
    { pos: [2.5, 0, 22] as [number, number, number], color: "#fb7185" },
    { pos: [-2.5, 0, 18] as [number, number, number], color: "#fde047" },
    { pos: [2.5, 0, 18] as [number, number, number], color: "#fde047" },
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    soundManager.playPortalEnter()
    onEnter()
  }

  return (
    <group>
      {/* ================= FOREGROUND FLUTED COLUMNS WITH ROSE BOUQUETS ================= */}
      <PillarColumn position={[-5.6, 0, 25]} height={5.4} hasBouquet={true} />
      <PillarColumn position={[5.6, 0, 25]} height={5.4} hasBouquet={true} />

      {/* Midground Pedestals with Bouquets */}
      <group position={[-4.2, 0, 20.5]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 2.4, 24]} />
          <meshStandardMaterial color="#101715" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.1} emissive="#b45309" emissiveIntensity={0.3} />
        </mesh>
        <FlowerBouquet position={[0, 2.5, 0]} scale={0.95} />
      </group>

      <group position={[4.2, 0, 20.5]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 2.4, 24]} />
          <meshStandardMaterial color="#101715" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.1} emissive="#b45309" emissiveIntensity={0.3} />
        </mesh>
        <FlowerBouquet position={[0, 2.5, 0]} scale={0.95} />
      </group>

      {/* Glowing Warm Spherical Lamp Pedestals (Đèn quả đào 2 tầng dịu mắt, không chói) */}
      {lampPedestals.map((lamp, idx) => (
        <group key={`lamp-${idx}`} position={lamp.pos}>
          {/* Small dark marble pedestal */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 1.5, 20]} />
            <meshStandardMaterial color="#101715" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.1} emissive="#b45309" emissiveIntensity={0.3} />
          </mesh>

          {/* Lower Golden Sphere */}
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          {/* Upper Pink Peach Sphere */}
          <mesh position={[0, 2.05, 0]}>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#f43f5e"
              emissiveIntensity={1.3}
              roughness={0.2}
            />
          </mesh>
          <pointLight position={[0, 1.95, 0]} color={lamp.color} intensity={1.0} distance={4} />
        </group>
      ))}

      {/* ================= ROYAL JACQUARD RED CARPET & DUAL NEON LED STRIPS ================= */}
      {/* Red Carpet with Damask Texture (Thảm Đỏ Vải Gấm Chìm) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 18.5]}>
        <planeGeometry args={[3.2, 23]} />
        <meshStandardMaterial
          map={carpetTexture}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      {/* Golden Fringe Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.61, 0.025, 18.5]}>
        <planeGeometry args={[0.06, 23]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.61, 0.025, 18.5]}>
        <planeGeometry args={[0.06, 23]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* DUAL GLOWING NEON LED STRIPS (Hai dải neon vàng thanh mảnh) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.76, 0.035, 18.5]}>
        <planeGeometry args={[0.08, 23]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.76, 0.035, 18.5]}>
        <planeGeometry args={[0.08, 23]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>

      {/* Soft warm light along the walkway */}
      <pointLight position={[0, 1.5, 22]} color="#fde047" intensity={1.2} distance={6} />
      <pointLight position={[0, 1.5, 17]} color="#fde047" intensity={1.2} distance={6} />

      {/* ================= THE MAIN ARCHWAY (Cổng Vòm Chính tại Z = 15) ================= */}
      <group position={[0, 0, 15]}>
        {/* Gate Flanking Columns with Flower Bouquets */}
        <PillarColumn position={[-3.8, 0, 0]} height={5.6} hasBouquet={true} />
        <PillarColumn position={[3.8, 0, 0]} height={5.6} hasBouquet={true} />
        <PillarColumn position={[-4.8, 0, 0.3]} height={4.8} hasBouquet={true} scale={0.88} />
        <PillarColumn position={[4.8, 0, 0.3]} height={4.8} hasBouquet={true} scale={0.88} />

        {/* Outer Glowing Neon Pink Arch */}
        <mesh position={[0, 6.2, 0]}>
          <torusGeometry args={[3.8, 0.08, 16, 64, Math.PI]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
        {/* Middle Glowing Neon Warm Gold Arch */}
        <mesh position={[0, 6.2, 0.06]}>
          <torusGeometry args={[3.55, 0.07, 16, 64, Math.PI]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
        {/* Inner Arch Light Trim */}
        <mesh position={[0, 6.2, 0.12]}>
          <torusGeometry args={[3.35, 0.04, 16, 48, Math.PI]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Apex Crown Crest Emblem */}
        <group position={[0, 10.05, 0.15]}>
          <mesh>
            <torusGeometry args={[0.7, 0.04, 16, 32]} />
            <meshBasicMaterial color="#fde047" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.35, 0.35, 0.08]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>

        {/* Sparkles around arch apex */}
        <Sparkles count={50} scale={[7, 3, 2]} position={[0, 8.5, 0]} color="#fef08a" size={3.5} speed={0.5} />

        {/* ================= TYPOGRAPHY (Chữ Thanh Lịch, Tương Phản Chuẩn) ================= */}
        <group position={[0, 7.8, 0.2]}>
          <Text
            position={[0, 0.48, 0]}
            fontSize={0.2}
            color="#fef08a"
            letterSpacing={0.12}
            anchorX="center"
            anchorY="middle"
          >
            CHÀO MỪNG NGÀY PHỤ NỮ VIỆT NAM
          </Text>

          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#ffffff"
            letterSpacing={0.06}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#831843"
          >
            ĐẠI SẢNH TRI ÂN 20-10
          </Text>

          <Text
            position={[0, -0.42, 0]}
            fontSize={0.16}
            color="#fbcfe8"
            letterSpacing={0.2}
            anchorX="center"
            anchorY="middle"
          >
            THE 20-10 CELESTIAL SANCTUARY
          </Text>
        </group>

        {/* ================= CENTRAL INTERACTIVE NEON PORTAL (Viên Pha Lê Ma Thuật) ================= */}
        <group
          position={[0, 3.2, 0]}
          onClick={handleClick}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
            setHovered(true)
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
            setHovered(false)
          }}
        >
          {/* Twin Glowing Concentric Neon Rings */}
          <group ref={ringRef}>
            {/* Outer Golden Neon Ring */}
            <mesh>
              <torusGeometry args={[2.2, 0.035, 16, 64]} />
              <meshBasicMaterial color="#fde047" />
            </mesh>
            {/* Inner Pink Neon Ring */}
            <mesh>
              <torusGeometry args={[1.8, 0.03, 16, 64]} />
              <meshBasicMaterial color="#f472b6" />
            </mesh>
          </group>

          {/* Magic Elongated Crystal Energy Core (Viên Pha Lê Ma Thuật Độc Bản) */}
          <Float speed={3} rotationIntensity={0.2} floatIntensity={0.35}>
            <MagicCrystalCore hovered={hovered} />

            {/* Click to Enter Badge with High Contrast Glass Backdrop */}
            <group position={[0, -1.25, 0.35]}>
              <mesh position={[0, 0, -0.04]}>
                <planeGeometry args={[2.4, 0.42]} />
                <meshBasicMaterial color="#0d0414" transparent opacity={0.88} />
              </mesh>
              <Text
                position={[0, 0, 0]}
                fontSize={0.19}
                color="#ffffff"
                letterSpacing={0.06}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#000000"
              >
                CLICK ĐỂ BƯỚC VÀO
              </Text>
            </group>
          </Float>

          {/* Portal Sparkles */}
          <Sparkles
            count={hovered ? 60 : 35}
            scale={[4, 4, 2]}
            color={hovered ? "#ffffff" : "#fef08a"}
            size={hovered ? 3.8 : 2.6}
            speed={0.7}
          />
        </group>

      </group>
    </group>
  )
}

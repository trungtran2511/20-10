import { useState } from 'react'
import { Float, Text } from '@react-three/drei'
import { soundManager } from '../utils/audio'

interface PillarItem {
  id: number
  title: string
  sub: string
  quote: string
  position: [number, number, number]
  color: string
}

const PILLARS: PillarItem[] = [
  {
    id: 1,
    title: "DỊU DÀNG",
    sub: "Elegance",
    quote: "Như dòng nước êm đềm xoa dịu những góc cạnh gồ ghề của cuộc đời.",
    position: [-3.2, 1.8, 10],
    color: "#f472b6"
  },
  {
    id: 2,
    title: "BẢN LĨNH",
    sub: "Resilience",
    quote: "Kiên cường trước mọi thử thách, tự tay vẽ nên cuộc sống rực rỡ của chính mình.",
    position: [3.2, 1.8, 10],
    color: "#fbbf24"
  },
  {
    id: 3,
    title: "BAO DUNG",
    sub: "Compassion",
    quote: "Trái tim rộng mở, luôn sưởi ấm gia đình và những người xung quanh bằng tình yêu thuần khiết.",
    position: [-3.6, 1.8, 6],
    color: "#a78bfa"
  },
  {
    id: 4,
    title: "RỰC RỠ",
    sub: "Radiance",
    quote: "Tỏa sáng theo cách rất riêng, mỗi nụ cười là một đóa hoa thơm ngát cho thế gian.",
    position: [3.6, 1.8, 6],
    color: "#38bdf8"
  }
]

interface PillarsOfVirtueProps {
  onSelectPillar: (pillar: PillarItem) => void
}

export function PillarsOfVirtue({ onSelectPillar }: PillarsOfVirtueProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <group>
      {PILLARS.map((p) => {
        const isHovered = hoveredId === p.id
        return (
          <group
            key={p.id}
            position={p.position}
            onClick={(e) => {
              e.stopPropagation()
              soundManager.playChime(650 + p.id * 80)
              onSelectPillar(p)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              setHoveredId(p.id)
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
              setHoveredId(null)
            }}
          >
            {/* Crystal Monolith Body */}
            <mesh position={[0, 0, 0]} scale={isHovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}>
              <boxGeometry args={[0.55, 3.2, 0.55]} />
              <meshStandardMaterial
                color="#200d1e"
                emissive={p.color}
                emissiveIntensity={isHovered ? 0.9 : 0.3}
                roughness={0.15}
                metalness={0.9}
                transparent
                opacity={0.88}
              />
            </mesh>

            {/* Glowing Corner Edges */}
            <mesh position={[0, 1.65, 0]}>
              <octahedronGeometry args={[0.22]} />
              <meshBasicMaterial color={p.color} />
            </mesh>

            {/* Inscription Text on Pillar Face */}
            <Text
              position={[0, 0.4, 0.3]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.015}
              outlineColor="#4a044e"
            >
              {p.title}
            </Text>
            <Text
              position={[0, 0.1, 0.3]}
              fontSize={0.11}
              color={p.color}
              anchorX="center"
              anchorY="middle"
            >
              {p.sub}
            </Text>

            {/* Floating click cue */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              <Text
                position={[0, -1.0, 0.3]}
                fontSize={0.09}
                color={isHovered ? "#ffffff" : "#fbcfe8"}
                anchorX="center"
                anchorY="middle"
              >
                (Chạm để xem)
              </Text>
            </Float>

            {/* Point Light per pillar */}
            <pointLight
              position={[0, 0, 0.6]}
              color={p.color}
              intensity={isHovered ? 2.5 : 0.8}
              distance={4}
            />
          </group>
        )
      })}
    </group>
  )
}

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { soundManager } from '../utils/audio'
import { createSinglePetalGeometry } from '../utils/sakuraPetals'

interface CrystalSphereProps {
  onShake: () => void
  onDrawWish: () => void
  isWishing: boolean
}

interface PetalData {
  position: THREE.Vector3
  rotation: THREE.Euler
  speed: number
  radius: number
  angle: number
  yOffset: number
}

export function CrystalSphere({ onShake, onDrawWish, isWishing }: CrystalSphereProps) {
  const [hovered, setHovered] = useState(false)
  const sphereRef = useRef<THREE.Group>(null)
  const innerLightRef = useRef<THREE.PointLight>(null)
  const petalsRef = useRef<THREE.InstancedMesh>(null)

  // Swirl velocity when shaken
  const swirlSpeed = useRef(1.0)
  const shakeOffset = useRef({ x: 0, y: 0, z: 0 })

  // Generate 45 petal orbits inside crystal sphere
  const petals = useMemo<PetalData[]>(() => {
    const list: PetalData[] = []
    for (let i = 0; i < 45; i++) {
      list.push({
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        speed: 0.5 + Math.random() * 0.8,
        radius: 0.2 + Math.random() * 0.7,
        angle: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 1.0
      })
    }
    return list
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const petalTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/textures/sakura_petal.png')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
  const petalGeometry = useMemo(() => createSinglePetalGeometry(0.24, 0.32), [])

  useEffect(() => {
    return () => {
      petalTexture.dispose()
      petalGeometry.dispose()
    }
  }, [petalTexture, petalGeometry])

  // Animate inner petals and sphere glow
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Decay swirl speed back to normal
    if (swirlSpeed.current > 1.0) {
      swirlSpeed.current = THREE.MathUtils.lerp(swirlSpeed.current, 1.0, delta * 1.5)
    }

    // Gentle shake decay
    shakeOffset.current.x = THREE.MathUtils.lerp(shakeOffset.current.y, 0, delta * 3)

    // Inner glowing light pulsing
    if (innerLightRef.current) {
      if (isWishing) {
        innerLightRef.current.intensity = 8.0 + Math.sin(t * 12) * 4.0
        innerLightRef.current.color.set('#fde047') // Golden glow on wish
      } else {
        innerLightRef.current.intensity = 2.2 + Math.sin(t * 2) * 0.6 + (hovered ? 1.0 : 0)
        innerLightRef.current.color.set('#f472b6') // Rose glow normal
      }
    }

    // Animate individual petals swirling inside the sphere
    if (petalsRef.current) {
      petals.forEach((p, i) => {
        p.angle += delta * p.speed * swirlSpeed.current
        const x = Math.cos(p.angle) * p.radius
        const z = Math.sin(p.angle) * p.radius
        const y = p.yOffset + Math.sin(t * 1.5 + i) * 0.15

        dummy.position.set(x, y, z)
        dummy.rotation.x = p.rotation.x + t * 0.5 * swirlSpeed.current
        dummy.rotation.y = p.rotation.y + t * 0.3 * swirlSpeed.current
        dummy.scale.setScalar(0.065 + Math.sin(i) * 0.015)
        dummy.updateMatrix()
        petalsRef.current!.setMatrixAt(i, dummy.matrix)
      })
      petalsRef.current.instanceMatrix.needsUpdate = true
    }

    // Gentle idle floating of the whole sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.12 * swirlSpeed.current
    }
  })

  const triggerShake = (e?: { stopPropagation: () => void }) => {
    if (e) e.stopPropagation()
    swirlSpeed.current = 4.5
    soundManager.playSwirl()
    onShake()
    soundManager.playWishMagic()
    onDrawWish()
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Ornate Pedestal */}
      <group position={[0, 0, 0]}>
        {/* Base Tier 1 */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[1.4, 1.6, 0.3, 32]} />
          <meshStandardMaterial color="#1a0c18" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Base Tier 2 (Golden Rim) */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.2, 1.25, 0.1, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.1}
            emissive="#92400e"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Column Shaft */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.7, 0.85, 0.9, 32]} />
          <meshStandardMaterial
            color="#2a1224"
            metalness={0.8}
            roughness={0.3}
            emissive="#501830"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Pedestal Capital / Dish */}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[1.1, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#f472b6" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Orbiting Halo Rings */}
        <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.65, 0.02, 16, 64]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[1.85, 0.015, 16, 64]} />
          <meshBasicMaterial color="#fbcfe8" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Main Interactive Crystal Sphere Group */}
      <group
        ref={sphereRef}
        position={[0, 1.8, 0]}
        onClick={triggerShake}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHovered(true)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          setHovered(false)
        }}
      >
        {/* Inner Light */}
        <pointLight ref={innerLightRef} distance={5} />

        {/* Inside the sphere: Miniature Cherry Blossom / Rose Bonsai */}
        <group position={[0, -0.4, 0]}>
          {/* Trunk / Stem */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.5, 12]} />
            <meshStandardMaterial color="#4a2511" roughness={0.8} />
          </mesh>
          {/* Branches */}
          <mesh position={[0.1, 0.45, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.025, 0.04, 0.3, 8]} />
            <meshStandardMaterial color="#4a2511" roughness={0.8} />
          </mesh>
          <mesh position={[-0.1, 0.48, 0.05]} rotation={[0.3, 0, 0.5]}>
            <cylinderGeometry args={[0.025, 0.04, 0.32, 8]} />
            <meshStandardMaterial color="#4a2511" roughness={0.8} />
          </mesh>

          {/* Glowing Rose Blossoms */}
          <mesh position={[0.15, 0.6, 0]}>
            <dodecahedronGeometry args={[0.14, 1]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#e11d48"
              emissiveIntensity={1.2}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.15, 0.64, 0.08]}>
            <dodecahedronGeometry args={[0.13, 1]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#be185d"
              emissiveIntensity={1.1}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.72, -0.05]}>
            <dodecahedronGeometry args={[0.16, 1]} />
            <meshStandardMaterial
              color="#fda4af"
              emissive="#f43f5e"
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Swirling Petals inside sphere with 2cfe4ec598247f1aafa06d4560ed570c.png detail */}
        <instancedMesh ref={petalsRef} args={[petalGeometry, undefined, 45]}>
          <meshStandardMaterial
            map={petalTexture}
            color="#ffffff"
            emissive="#fb7185"
            emissiveIntensity={0.65}
            side={THREE.DoubleSide}
            transparent
            alphaTest={0.03}
            roughness={0.4}
            metalness={0.05}
          />
        </instancedMesh>

        {/* Golden Fairy Dust trapped inside */}
        <Sparkles count={35} scale={1.8} size={2.5} speed={0.9} color="#fef08a" />

        {/* Crystal Glass Outer Shell */}
        <mesh scale={hovered ? 1.03 : 1.0}>
          <sphereGeometry args={[1.05, 64, 64]} />
          <meshPhysicalMaterial
            roughness={0.05}
            metalness={0.1}
            transmission={0.92}
            ior={1.48}
            thickness={1.2}
            transparent
            opacity={1}
            color="#ffffff"
            emissive={hovered ? "#4a044e" : "#1e1b4b"}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Floating Crisp Label & Prompt above Crystal Sphere */}

    </group>
  )
}

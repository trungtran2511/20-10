import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface ExhibitionHallProps {
  showStonePathway?: boolean
}

export function ExhibitionHall({ showStonePathway = true }: ExhibitionHallProps) {
  const stones = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ z: 30 - i * 1.16, shade: i % 3 === 0 ? '#b8aeb1' : '#cec5c0' })), [])

  // 4K Grass Ground PBR texture from grass_ground_4k.blend
  const grassTexture = useLoader(THREE.TextureLoader, '/textures/grass_ground/grass_ground_diff_4k.jpg')
  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(30, 30)
  grassTexture.colorSpace = THREE.SRGBColorSpace

  return (
    <group>
      {/* Expansive Lush Meadow Ground Layer from grass_ground_4k stretching to horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 7]} receiveShadow>
        <planeGeometry args={[320, 320]} />
        <meshStandardMaterial
          map={grassTexture}
          color="#b6e0a5"
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* Continuous raised paving ensures grass ground cannot show through. */}
      {showStonePathway && (
        <mesh position={[0, -0.015, 7]} receiveShadow>
          <boxGeometry args={[4.4, 0.10, 48]} />
          <meshStandardMaterial color="#cbbdb6" roughness={0.96} />
        </mesh>
      )}
      {/* Stone pathway and edging */}
      {showStonePathway && (
        <>
          {/* Pathway borders and low garden stone lanterns */}
          {[-1, 1].map(side => (
            <group key={side}>
              <mesh position={[side * 2.25, 0.015, 7]}>
                <boxGeometry args={[0.14, 0.12, 48]} />
                <meshStandardMaterial color="#c8af9f" roughness={0.85} />
              </mesh>
              {[24, 17, 10, 3, -4, -11].map(z => (
                <group key={z} position={[side * 2.8, 0, z]}>
                  <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.48, 0.3, 0.48]} /><meshStandardMaterial color="#4c4347" /></mesh>
                  <mesh position={[0, 0.48, 0]}><boxGeometry args={[0.3, 0.4, 0.3]} /><meshStandardMaterial color="#ffe2bb" emissive="#ffc487" emissiveIntensity={1.3} /></mesh>
                  <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.42, 0.2, 4]} /><meshStandardMaterial color="#53404a" roughness={0.9} /></mesh>
                </group>
              ))}
            </group>
          ))}

          {/* Flagstone paving along central garden path */}
          {stones.map((stone, i) => (
            <group key={i} position={[0, 0, stone.z]}>
              {[-1, 1].map(side => (
                <mesh key={side} position={[side * 1.08, -0.015, 0]} receiveShadow>
                  <boxGeometry args={[2.12, 0.07, 1.12]} />
                  <meshStandardMaterial color={stone.shade} roughness={0.92} />
                </mesh>
              ))}
            </group>
          ))}
        </>
      )}
    </group>
  )
}

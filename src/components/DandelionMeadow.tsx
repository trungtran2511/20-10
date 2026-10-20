import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface PatchConfig {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: [number, number, number]
}

// Drifting Dandelion Fluff Seeds (Hạt bồ công anh trắng bay lơ lửng trong gió)
function DandelionFluffDrift({ count = 180 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Procedural fluffy dandelion seed texture with glowing parachute hairs
  const fluffTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // Brownish seed pip at bottom
    ctx.fillStyle = '#4a3622'
    ctx.beginPath()
    ctx.ellipse(64, 106, 3, 6.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Fine delicate stem stalk
    ctx.strokeStyle = 'rgba(245, 245, 245, 0.88)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(64, 100)
    ctx.lineTo(64, 45)
    ctx.stroke()

    // Radial white parachute fluff filaments
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.lineWidth = 1.25
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 1.65 - Math.PI * 0.32
      const len = 34 + (i % 4) * 4
      ctx.beginPath()
      ctx.moveTo(64, 45)
      ctx.lineTo(64 + Math.cos(a) * len, 45 - Math.sin(a) * len * 0.82)
      ctx.stroke()
    }

    // Soft luminous center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.beginPath()
    ctx.arc(64, 45, 4.5, 0, Math.PI * 2)
    ctx.fill()

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Seed particles simulation state
  const seeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 24,
      y: 0.15 + Math.random() * 5.8,
      z: 32 - Math.random() * 50,
      speedY: 0.14 + Math.random() * 0.24,
      speedX: 0.22 + Math.random() * 0.36,
      phase: Math.random() * Math.PI * 2,
      scale: 0.18 + Math.random() * 0.18,
      rotSpeed: (Math.random() - 0.5) * 1.4
    }))
  }, [count])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    seeds.forEach((s, i) => {
      // Wind drift motion (cuốn theo làn gió đung đưa)
      s.x += (Math.sin(t * 1.4 + s.phase) * s.speedX + 0.2) * delta
      s.y += (Math.sin(t * 0.95 + s.phase) * 0.14 + s.speedY) * delta
      s.z -= delta * 0.42 // Breeze blowing through the garden toward the crystal sphere

      // Loop boundary reset
      if (s.y > 7.0) {
        s.y = 0.15 + Math.random() * 0.3
        s.x = (Math.random() - 0.5) * 24
        s.z = 32 - Math.random() * 46
      }
      if (s.x > 14) s.x = -14
      if (s.z < -20) s.z = 32

      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.z = Math.sin(t * 1.2 + s.phase) * 0.25
      dummy.rotation.y = t * s.rotSpeed
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={fluffTexture}
        transparent
        opacity={0.94}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

// Low-cost fine grass accents: one instanced draw call instead of hundreds of meshes.
function FineGrassDetails() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = 520
  const entries = useMemo(() => {
    let seed = 20261020
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    return Array.from({ length: count }, () => {
      const side = random() > 0.5 ? 1 : -1
      return {
        x: side * (4.3 + random() * 12),
        z: -20 + random() * 51,
        h: 0.22 + random() * 0.48,
        width: 0.55 + random() * 0.85,
        angle: random() * Math.PI * 2,
        tint: new THREE.Color().setHSL(0.255 + random() * 0.07, 0.36 + random() * 0.18, 0.32 + random() * 0.2)
      }
    })
  }, [])
  useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    entries.forEach((blade, i) => {
      dummy.position.set(blade.x, blade.h * 0.5 - 0.025, blade.z)
      dummy.rotation.set(0, blade.angle, (i % 2 ? 1 : -1) * 0.08)
      dummy.scale.set(blade.width, blade.h, blade.width)
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
      ref.current!.setColorAt(i, blade.tint)
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [entries])
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.035, -0.5)
    shape.quadraticCurveTo(-0.046, -0.07, 0.002, 0.5)
    shape.quadraticCurveTo(0.032, -0.10, 0.035, -0.5)
    return new THREE.ShapeGeometry(shape, 4)
  }, [])
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial color="#c5e7a8" side={THREE.DoubleSide} roughness={0.95} />
    </instancedMesh>
  )
}

export function DandelionMeadow() {
  const gltf = useGLTF('/models/countryside_path.glb')
  const patchRefs = useRef<(THREE.Group | null)[]>([])
  const windUniforms = useRef({
    uTime: { value: 0 },
    uWindSpeed: { value: 2.3 },
    uWindStrength: { value: 0.24 }
  })

  // Configure materials with wind sway vertex shader and center vegetation geometry
  useLayoutEffect(() => {
    clonedPatches.forEach(({ clone }) => {
      clone.traverse((obj) => {
        if (
          obj.name === 'Object_4' ||
          obj.name === 'ground_0' ||
          obj.name.toLowerCase().includes('ground') ||
          ((obj as THREE.Mesh).isMesh && ((obj as THREE.Mesh).material as THREE.Material)?.name?.includes('005'))
        ) {
          obj.visible = false
          return
        }

        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true

          // Center vegetation geometry in X and Z so instances position predictably
          if (!mesh.userData.centered && mesh.geometry) {
            mesh.geometry.computeBoundingBox()
            const bb = mesh.geometry.boundingBox!
            const cx = (bb.max.x + bb.min.x) / 2
            const cz = (bb.max.z + bb.min.z) / 2
            mesh.geometry.translate(-cx, 0, -cz)
            mesh.userData.centered = true
          }

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => setupMaterial(mat))
          } else if (mesh.material) {
            setupMaterial(mesh.material)
          }
        }
      })
    })

    function setupMaterial(mat: THREE.Material) {
      if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
        const m = mat as THREE.MeshStandardMaterial

        // Configure vegetation material (Material.001 - Dandelions, seed heads, wheat, grass)
        if (m.name.includes('Material.001') || m.name.includes('001')) {
          m.color.set('#b0e89d')
          m.emissive = new THREE.Color('#163d16')
          m.emissiveIntensity = 0.06
          m.alphaTest = 0.45
          m.transparent = true
          m.depthWrite = true
          m.side = THREE.DoubleSide
          m.roughness = 0.75
          m.customProgramCacheKey = () => 'dandelion-wind-sway-v3'

          // Hook wind sway into vertex shader (ngọn cỏ và hoa bồ công anh đung đưa theo gió)
          m.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = windUniforms.current.uTime
            shader.uniforms.uWindSpeed = windUniforms.current.uWindSpeed
            shader.uniforms.uWindStrength = windUniforms.current.uWindStrength

            shader.vertexShader = `
              uniform float uTime;
              uniform float uWindSpeed;
              uniform float uWindStrength;
            ` + shader.vertexShader

            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              // Sway tops of dandelions, seed puffs, and grass blades while keeping roots anchored
              float h = max(0.0, position.y);
              float flex = min(h, 2.4);
              float windWave = sin(uTime * uWindSpeed + (position.x + 10.0) * 0.45 + (position.z + 10.0) * 0.35);
              float gust = cos(uTime * 0.95 + position.z * 0.25) * 0.45 + 0.55;
              transformed.x += (windWave * uWindStrength * flex * gust);
              transformed.z += (cos(uTime * (uWindSpeed * 0.75) + position.x * 0.32) * (uWindStrength * 0.65) * flex * gust);
              `
            )
          }
          m.needsUpdate = true
        }
      }
    }
  }, [gltf])

  // Patches cleanly distributed along both sides of the central garden walkway corridor
  const patches: PatchConfig[] = useMemo(() => [
    // --- LEFT FLANK (Dọc lề cỏ bên trái, lùi xa để không lấn vào đường đi) ---
    // Inner border: kept safely outside x = -4.5
    { pos: [-4.6, -0.02, 26], rot: [0, 0.3, 0], scale: [1.02, 1, 1.02] },
    { pos: [-4.7, -0.02, 20], rot: [0, 1.2, 0], scale: [1.05, 1, 1.05] },
    { pos: [-4.5, -0.02, 14], rot: [0, -0.4, 0], scale: [1.0, 1, 1.0] },
    { pos: [-4.8, -0.02, 8], rot: [0, 2.1, 0], scale: [1.08, 1, 1.08] },
    { pos: [-4.6, -0.02, 2], rot: [0, 0.7, 0], scale: [1.03, 1, 1.03] },
    { pos: [-4.7, -0.02, -4], rot: [0, -1.3, 0], scale: [1.05, 1, 1.05] },
    { pos: [-4.5, -0.02, -10], rot: [0, 0.5, 0], scale: [1.02, 1, 1.02] },
    { pos: [-4.8, -0.02, -16], rot: [0, 1.7, 0], scale: [1.06, 1, 1.06] },

    // Outer meadow layer (Bụi hoa rộng phía sau)
    { pos: [-6.8, -0.02, 23], rot: [0, -0.9, 0], scale: [1.12, 1.05, 1.12] },
    { pos: [-7.0, -0.02, 16], rot: [0, 2.4, 0], scale: [1.15, 1.05, 1.15] },
    { pos: [-6.7, -0.02, 9], rot: [0, 0.4, 0], scale: [1.1, 1.05, 1.1] },
    { pos: [-7.2, -0.02, 1], rot: [0, -1.8, 0], scale: [1.14, 1.05, 1.14] },
    { pos: [-6.8, -0.02, -7], rot: [0, 1.1, 0], scale: [1.12, 1.05, 1.12] },
    { pos: [-7.0, -0.02, -14], rot: [0, -0.6, 0], scale: [1.1, 1.05, 1.1] },

    // Deep lateral field (Đồng cỏ bồ công anh xa bên trái)
    { pos: [-9.5, -0.02, 18], rot: [0, 1.5, 0], scale: [1.22, 1.1, 1.22] },
    { pos: [-9.2, -0.02, 8], rot: [0, -2.2, 0], scale: [1.2, 1.1, 1.2] },
    { pos: [-9.6, -0.02, -3], rot: [0, 0.8, 0], scale: [1.25, 1.1, 1.25] },

    // --- RIGHT FLANK (Dọc lề cỏ bên phải, lùi xa để không lấn vào đường đi) ---
    // Inner border: kept safely outside x = +4.5
    { pos: [4.6, -0.02, 26], rot: [0, -0.4, 0], scale: [1.02, 1, 1.02] },
    { pos: [4.7, -0.02, 20], rot: [0, -1.1, 0], scale: [1.05, 1, 1.05] },
    { pos: [4.5, -0.02, 14], rot: [0, 0.6, 0], scale: [1.0, 1, 1.0] },
    { pos: [4.8, -0.02, 8], rot: [0, -2.3, 0], scale: [1.08, 1, 1.08] },
    { pos: [4.6, -0.02, 2], rot: [0, -0.6, 0], scale: [1.03, 1, 1.03] },
    { pos: [4.7, -0.02, -4], rot: [0, 1.4, 0], scale: [1.05, 1, 1.05] },
    { pos: [4.5, -0.02, -10], rot: [0, -0.4, 0], scale: [1.02, 1, 1.02] },
    { pos: [4.8, -0.02, -16], rot: [0, -1.8, 0], scale: [1.06, 1, 1.06] },

    // Outer meadow layer (Bụi hoa rộng phía sau)
    { pos: [6.8, -0.02, 23], rot: [0, 0.8, 0], scale: [1.12, 1.05, 1.12] },
    { pos: [7.0, -0.02, 16], rot: [0, -2.1, 0], scale: [1.15, 1.05, 1.15] },
    { pos: [6.7, -0.02, 9], rot: [0, -0.5, 0], scale: [1.1, 1.05, 1.1] },
    { pos: [7.2, -0.02, 1], rot: [0, 1.9, 0], scale: [1.14, 1.05, 1.14] },
    { pos: [6.8, -0.02, -7], rot: [0, -1.2, 0], scale: [1.12, 1.05, 1.12] },
    { pos: [7.0, -0.02, -14], rot: [0, 0.7, 0], scale: [1.1, 1.05, 1.1] },

    // Deep lateral field (Đồng cỏ bồ công anh xa bên phải)
    { pos: [9.5, -0.02, 18], rot: [0, -1.6, 0], scale: [1.22, 1.1, 1.22] },
    { pos: [9.2, -0.02, 8], rot: [0, 2.0, 0], scale: [1.2, 1.1, 1.2] },
    { pos: [9.6, -0.02, -3], rot: [0, -0.9, 0], scale: [1.25, 1.1, 1.25] },

    // Far background behind sanctuary altar
    { pos: [-5.0, -0.02, -20], rot: [0, 0.5, 0], scale: [1.15, 1.05, 1.15] },
    { pos: [5.0, -0.02, -20], rot: [0, -0.5, 0], scale: [1.15, 1.05, 1.15] },
  ], [])

  // Clone scene objects for each patch with ground mound removed
  const clonedPatches = useMemo(() => {
    return patches.map((p) => {
      const clone = gltf.scene.clone(true)
      clone.traverse((obj) => {
        if (
          obj.name === 'Object_4' ||
          obj.name === 'ground_0' ||
          obj.name.toLowerCase().includes('ground') ||
          ((obj as THREE.Mesh).isMesh && ((obj as THREE.Mesh).material as THREE.Material)?.name?.includes('005'))
        ) {
          obj.visible = false
        }
      })
      return { clone, config: { ...p, pos: [p.pos[0] + Math.sign(p.pos[0]) * 2.6, p.pos[1], p.pos[2]] as [number, number, number] } }
    })
  }, [gltf.scene, patches])

  // Update wind animation time uniform & whole-patch gentle macro wave
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    windUniforms.current.uTime.value += delta

    // Macro wind sway across the meadow patches
    patchRefs.current.forEach((ref, idx) => {
      if (ref) {
        const wave = Math.sin(t * 1.5 + idx * 0.6) * 0.025
        ref.rotation.z = patches[idx].rot[2] + wave
        ref.rotation.x = patches[idx].rot[0] + Math.cos(t * 1.1 + idx * 0.4) * 0.015
      }
    })
  })

  return (
    <group>
      {/* Expansive Dandelion & Wildflower Meadow Patches */}
      {clonedPatches.map((item, idx) => (
        <group
          key={`dandi-patch-${idx}`}
          ref={(el) => { patchRefs.current[idx] = el }}
          position={item.config.pos}
          rotation={item.config.rot}
          scale={item.config.scale}
        >
          <primitive object={item.clone} />
        </group>
      ))}

      <FineGrassDetails />

      {/* Floating Dandelion Fluff Particles in the Wind */}
      <DandelionFluffDrift count={180} />
    </group>
  )
}

useGLTF.preload('/models/countryside_path.glb')

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraController } from './CameraController'
import { ExhibitionHall } from './ExhibitionHall'
import { CrystalSphere } from './CrystalSphere'
import { PostProcessing } from './PostProcessing'
import { SakuraWalk } from './SakuraWalk'
import { SunsetEnvironment } from './SunsetEnvironment'
import { DandelionMeadow } from './DandelionMeadow'
import { BackgroundFlowers } from './BackgroundFlowers'
import { FlowerMeadow2D } from './FlowerMeadow2D'
import { SakuraGlowMotes } from './SakuraGlowMotes'

function SceneReady({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    // Component mounts after the scene's Suspense assets have resolved.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

interface SceneProps {
  flyTargetZ: number | null
  onFlyComplete: () => void
  onEnterHall: () => void
  onSelectPillar: (pillar: any) => void
  onShakeSphere: () => void
  onDrawWish: () => void
  isWishing: boolean
  controlsEnabled: boolean
  onJourneyPosition?: (z: number) => void
  onSceneReady?: () => void
}

export function Scene({
  flyTargetZ,
  onFlyComplete,
  onEnterHall,
  onSelectPillar,
  onShakeSphere,
  onDrawWish,
  isWishing,
  controlsEnabled,
  onJourneyPosition,
  onSceneReady
}: SceneProps) {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 3.2, 33], fov: 62 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        {/* Keep the garden visible while the local 4K EXR loads. */}
        <color attach="background" args={['#bda1a5']} />
        <fog attach="fog" args={['#c8c4c0', 46, 110]} />
        <Suspense fallback={null}>
          <SunsetEnvironment />
        </Suspense>

        {/* Balanced Multi-directional Lighting */}
        <hemisphereLight args={['#fffaf0', '#b3c9a6', 1.62]} />
        <directionalLight position={[10, 20, 24]} intensity={1.85} color="#fff7e9" />
        <directionalLight position={[-12, 9, 4]} intensity={0.4} color="#fce3e8" />
        <pointLight position={[0, 8, 15]} intensity={0.8} color="#ffe1e0" distance={24} />
        <pointLight position={[0, 7, 2]} intensity={0.6} color="#ffe5e1" distance={20} />

        {/* Continuous Smooth Mouse Camera Controller */}
        <CameraController flyTargetZ={flyTargetZ} onFlyComplete={onFlyComplete} enabled={controlsEnabled} onJourneyPosition={onJourneyPosition} />

        <Suspense fallback={null}>
          {/* Stone walkway and low garden lanterns */}
          <ExhibitionHall />

          {/* Dandelion & Wildflower Meadow with wind sway animation & drifting seed fluff */}
          <DandelionMeadow />
          <FlowerMeadow2D />
          <BackgroundFlowers />

          {/* Two rows of the imported Sakura GLB and drifting petals */}
          <SakuraWalk />

          {/* Atmospheric Golden-Pink Glowing Pollen & Light Motes */}
          <SakuraGlowMotes />
          <SceneReady onReady={onSceneReady} />


          {/* Hero Centerpiece: The Wishing Crystal Sphere */}
          <CrystalSphere
            onShake={onShakeSphere}
            onDrawWish={onDrawWish}
            isWishing={isWishing}
          />

        </Suspense>

        {/* Native Three.js Unreal Bloom Effect */}
        <PostProcessing />
      </Canvas>
    </div>
  )
}

import { useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export function PostProcessing() {
  const { gl, scene, camera, size } = useThree()

  const composer = useMemo(() => {
    const renderScene = new RenderPass(scene, camera)
    // Controlled, cinematic bloom that never overexposes or burns white
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.12, // The HDR sun is very bright; keep its bloom from washing out the trees.
      0.3,
      1.35
    )

    const comp = new EffectComposer(gl)
    comp.addPass(renderScene)
    comp.addPass(bloomPass)
    // Map the EXR's HDR values to the display after bloom.
    comp.addPass(new OutputPass())
    return comp
  }, [gl, scene, camera])

  useEffect(() => () => {
    composer.passes.forEach(pass => pass.dispose())
    composer.dispose()
  }, [composer])

  useEffect(() => {
    composer.setSize(size.width, size.height)
  }, [composer, size])

  // Render composer instead of standard scene render
  useFrame(() => {
    composer.render()
  }, 1)

  return null
}

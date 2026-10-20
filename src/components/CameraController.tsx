import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

interface CameraControllerProps {
  flyTargetZ: number | null
  onFlyComplete?: () => void
  enabled: boolean
  onJourneyPosition?: (z: number) => void
}

export function CameraController({ flyTargetZ, onFlyComplete, enabled, onJourneyPosition }: CameraControllerProps) {
  const { camera, gl, size } = useThree()

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Keep the gateway in frame on portrait screens as well as desktop.
      const aspect = size.width / size.height
      camera.fov = THREE.MathUtils.clamp(
        THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(29)) / Math.min(aspect, 1))),
        66,
        104
      )
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, size.height])
  
  // Starting position matching image_1.png framing (framed by the two foreground flower pillars)
  const currentZ = useRef(33)
  const targetZ = useRef(33)
  const lookAtTarget = useRef(new THREE.Vector3(0, 3.5, 12.0))
  
  // Mouse parallax (di chuột ngắm nhìn)
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const lastReportedStage = useRef(-1)
  const journeyStops = [33, 25, 20.5, 16.5, 11.5, 5.2]
  const journeyIndex = useRef(0)
  const lastWheelAt = useRef(0)
  const lookAngles = useRef({ yaw: 0, pitch: 0 })
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Respond to programmatic fly-through (e.g. clicking the Gate)
  useEffect(() => {
    if (flyTargetZ !== null) {
      journeyIndex.current = journeyStops.reduce((best, z, i) => Math.abs(z - flyTargetZ) < Math.abs(journeyStops[best] - flyTargetZ) ? i : best, 0)
      const obj = { z: currentZ.current }
      const tween = gsap.to(obj, {
        z: flyTargetZ,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          targetZ.current = obj.z
          currentZ.current = obj.z
        },
        onComplete: () => {
          if (onFlyComplete) onFlyComplete()
        }
      })
      return () => { tween.kill() }
    }
  }, [flyTargetZ, onFlyComplete])

  useEffect(() => {
    if (!enabled) return
    const surface = gl.domElement
    // 1. Mouse move: Parallax look-around (di chuột)
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 1.8
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 1.2

      // Drag to look around freely, full 360 degrees on the horizontal axis.
      if (isDragging.current) {
        lookAngles.current.yaw -= (e.clientX - lastMousePos.current.x) * 0.005
        lookAngles.current.pitch = THREE.MathUtils.clamp(lookAngles.current.pitch + (e.clientY - lastMousePos.current.y) * 0.004, -1.18, 1.18)
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      }
    }

    // 2. Mouse wheel: Smooth scroll forward/backward (cuộn chuột)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 1) return
      const now = performance.now()
      // Lock one scroll gesture to one milestone (also handles fast mouse wheels).
      if (now - lastWheelAt.current < 850) return
      lastWheelAt.current = now
      journeyIndex.current = THREE.MathUtils.clamp(
        journeyIndex.current + (e.deltaY > 0 ? 1 : -1), 0, journeyStops.length - 1
      )
      targetZ.current = journeyStops[journeyIndex.current]
    }

    // 3. Pointer drag start
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging.current = true
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      }
    }

    // 4. Pointer drag end
    const handleMouseUp = () => {
      isDragging.current = false
    }

    // 5. Touch support for mobile / touchpads
    let touchStartY = 0
    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaY = e.touches[0].clientY - touchStartY
        const deltaX = e.touches[0].clientX - touchStartX
        touchStartY = e.touches[0].clientY
        touchStartX = e.touches[0].clientX
        lookAngles.current.yaw -= deltaX * 0.005
        lookAngles.current.pitch = THREE.MathUtils.clamp(lookAngles.current.pitch + deltaY * 0.004, -1.18, 1.18)
      }
    }

    surface.addEventListener('mousemove', handleMouseMove)
    surface.addEventListener('wheel', handleWheel, { passive: false })
    surface.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    surface.addEventListener('mouseleave', handleMouseUp)
    surface.addEventListener('touchstart', handleTouchStart, { passive: true })
    surface.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      isDragging.current = false
      surface.removeEventListener('mousemove', handleMouseMove)
      surface.removeEventListener('wheel', handleWheel)
      surface.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      surface.removeEventListener('mouseleave', handleMouseUp)
      surface.removeEventListener('touchstart', handleTouchStart)
      surface.removeEventListener('touchmove', handleTouchMove)
    }
  }, [gl, enabled])

  useFrame((state, delta) => {
    // Smoothly interpolate current camera Z to target Z
    currentZ.current = THREE.MathUtils.lerp(currentZ.current, targetZ.current, delta * 3.2)

    // Smoothly interpolate mouse parallax
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.targetX, delta * 4)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.targetY, delta * 4)

    const z = currentZ.current
    const stage = z > 29 ? 0 : z > 22.75 ? 1 : z > 18.5 ? 2 : z > 14 ? 3 : z > 8 ? 4 : 5
    if (stage !== lastReportedStage.current) {
      lastReportedStage.current = stage
      onJourneyPosition?.(z)
    }

    // Dynamically calculate camera position and lookAt target
    let targetY = 3.2
    let lookTargetX = 0
    let lookTargetY = 4.0
    let lookTargetZ = 15.0

    if (z > 17.0) {
      // Wide panoramic view outside the Gateway, perfectly framed
      targetY = 3.2
      lookTargetX = 0
      lookTargetY = 4.0
      lookTargetZ = 15.0
    } else if (z > 7.0) {
      // Passing through the gateway arch, approaching the pillars
      targetY = 2.6
      lookTargetX = 0
      lookTargetY = 2.2
      lookTargetZ = 1.0
    } else if (z > 0.5) {
      // Standing in front of the Crystal Sphere
      targetY = 2.4
      lookTargetX = 0
      lookTargetY = 1.8
      lookTargetZ = 0.0
    } else {
      // Stop at the crystal sphere; no card creation space beyond it.
      targetY = 2.4
      lookTargetX = 0
      lookTargetY = 1.8
      lookTargetZ = 0.0
    }

    camera.position.x = mouse.current.x * 0.8
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY - mouse.current.y * 0.4, 4, delta)
    camera.position.z = z

    lookAtTarget.current.x = THREE.MathUtils.lerp(lookAtTarget.current.x, lookTargetX + mouse.current.x * 1.5, delta * 5)
    lookAtTarget.current.y = THREE.MathUtils.lerp(lookAtTarget.current.y, lookTargetY - mouse.current.y * 1.2, delta * 5)
    lookAtTarget.current.z = THREE.MathUtils.lerp(lookAtTarget.current.z, lookTargetZ, delta * 5)

    const direction = lookAtTarget.current.clone().sub(camera.position).normalize()
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), lookAngles.current.yaw)
    const horizontal = Math.hypot(direction.x, direction.z)
    const basePitch = Math.atan2(direction.y, horizontal)
    const pitch = THREE.MathUtils.clamp(basePitch - lookAngles.current.pitch, -1.42, 1.42)
    const heading = Math.atan2(direction.x, direction.z)
    camera.lookAt(camera.position.clone().add(new THREE.Vector3(Math.sin(heading) * Math.cos(pitch), Math.sin(pitch), Math.cos(heading) * Math.cos(pitch))))
  })

  return null
}

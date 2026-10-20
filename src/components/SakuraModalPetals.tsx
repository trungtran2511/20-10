import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotationSpeed: number
  opacity: number
  color: string
  flip: number
  flipSpeed: number
}

const PETAL_COLORS = [
  'rgba(255, 182, 193, 0.75)',
  'rgba(255, 192, 203, 0.85)',
  'rgba(254, 205, 211, 0.8)',
  'rgba(251, 113, 133, 0.65)',
  'rgba(255, 241, 242, 0.9)'
]

export function SakuraModalPetals({ count = 22 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }

    const observer = new ResizeObserver(handleResize)
    if (canvas.parentElement) observer.observe(canvas.parentElement)

    // Initialize petals
    const petals: Petal[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 7 + Math.random() * 8,
      speedY: 0.6 + Math.random() * 0.9,
      speedX: -0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.5 + Math.random() * 0.45,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      flip: Math.random() * Math.PI,
      flipSpeed: 0.02 + Math.random() * 0.03
    }))

    // Draw realistic notched sakura petal path
    function drawSakuraPetal(c: CanvasRenderingContext2D, size: number) {
      c.beginPath()
      c.moveTo(0, size * 0.6)
      c.bezierCurveTo(-size * 0.7, size * 0.2, -size * 0.6, -size * 0.6, -size * 0.15, -size * 0.8)
      c.lineTo(0, -size * 0.65) // Heart notch
      c.lineTo(size * 0.15, -size * 0.8)
      c.bezierCurveTo(size * 0.6, -size * 0.6, size * 0.7, size * 0.2, 0, size * 0.6)
      c.closePath()
      c.fill()
    }

    let time = 0
    function animate() {
      time += 0.015
      ctx!.clearRect(0, 0, width, height)

      petals.forEach(p => {
        p.y += p.speedY
        p.x += p.speedX + Math.sin(time + p.rotation) * 0.45
        p.rotation += p.rotationSpeed
        p.flip += p.flipSpeed

        // Wrap around bounds
        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x < -20) p.x = width + 10
        if (p.x > width + 20) p.x = -10

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.rotation)
        // 3D flipping projection
        ctx!.scale(Math.cos(p.flip), 1)
        ctx!.fillStyle = p.color
        ctx!.shadowColor = 'rgba(244, 63, 94, 0.25)'
        ctx!.shadowBlur = 4
        drawSakuraPetal(ctx!, p.size)
        ctx!.restore()
      })

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [count, reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full rounded-[22px] overflow-hidden"
      aria-hidden="true"
    />
  )
}

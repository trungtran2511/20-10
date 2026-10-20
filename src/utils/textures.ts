import * as THREE from 'three'

// Procedural Dark Jade / Emerald Luxury Marble Texture (Nền Đá Hoa Cương Cẩm Thạch Sang Trọng)
export function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Base rich dark marble gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024)
  grad.addColorStop(0, '#15201d')
  grad.addColorStop(0.35, '#1e2d29')
  grad.addColorStop(0.7, '#162320')
  grad.addColorStop(1, '#1b2a26')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 1024)

  // Swirling cloudy marbling veins
  ctx.fillStyle = 'rgba(42, 65, 58, 0.4)'
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 1024
    const r = 70 + Math.random() * 180
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Soft white/mint mineral streaks
  ctx.lineWidth = 2.0
  ctx.strokeStyle = 'rgba(110, 160, 145, 0.35)'
  for (let i = 0; i < 22; i++) {
    ctx.beginPath()
    let x = Math.random() * 1024
    let y = 0
    ctx.moveTo(x, y)
    while (y < 1024) {
      x += (Math.random() - 0.5) * 65
      y += 25 + Math.random() * 35
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Prominent Gold Veins (Chỉ vàng cẩm thạch hoàng gia)
  ctx.lineWidth = 1.8
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'
  for (let i = 0; i < 15; i++) {
    ctx.beginPath()
    let x = Math.random() * 1024
    let y = 0
    ctx.moveTo(x, y)
    while (y < 1024) {
      x += (Math.random() - 0.48) * 50
      y += 30 + Math.random() * 45
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Tiled Marble Seam Grid (Gạch đá hoa cương kích thước lớn viền chỉ vàng)
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
  ctx.lineWidth = 2.5
  for (let p = 0; p <= 1024; p += 256) {
    // Vertical seams
    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, 1024)
    ctx.stroke()

    // Horizontal seams
    ctx.beginPath()
    ctx.moveTo(0, p)
    ctx.lineTo(1024, p)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 10)
  return texture
}

// Procedural Royal Damask Jacquard Pattern for Red Carpet (Vải Gấm Hoàng Gia Thêu Hoa Văn)
export function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Deep crimson velvet base
  ctx.fillStyle = '#8b1323'
  ctx.fillRect(0, 0, 512, 512)

  // Repeating Damask Diamond Pattern
  ctx.fillStyle = '#a81c30'
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
  ctx.lineWidth = 1.8

  const step = 64
  for (let x = 0; x < 512; x += step) {
    for (let y = 0; y < 512; y += step) {
      // Diamond motif
      ctx.beginPath()
      ctx.moveTo(x + step / 2, y)
      ctx.lineTo(x + step, y + step / 2)
      ctx.lineTo(x + step / 2, y + step)
      ctx.lineTo(x, y + step / 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Center decorative floral pip
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)'
      ctx.beginPath()
      ctx.arc(x + step / 2, y + step / 2, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#a81c30'
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 12)
  return texture
}

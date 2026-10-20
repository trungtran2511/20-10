import * as THREE from 'three'

/**
 * Generates an organically curved 3D Sakura Petal Geometry mapped to a specific cell
 * in the sakura_petals_atlas.png texture (4 columns x 2 rows).
 * Based on the reference image 2cfe4ec598247f1aafa06d4560ed570c.png
 */
export function createAtlasPetalGeometry(
  col: number,
  row: number,
  width = 0.15,
  height = 0.20
): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(width, height, 5, 5)
  const pos = geom.attributes.position
  const uvs = geom.attributes.uv

  // Atlas UV coordinates (4 cols x 2 rows)
  const uMin = col * 0.25
  const uMax = (col + 1) * 0.25
  const vMin = 1.0 - (row + 1) * 0.5
  const vMax = 1.0 - row * 0.5

  for (let i = 0; i < uvs.count; i++) {
    const u = uvs.getX(i)
    const v = uvs.getY(i)
    uvs.setXY(i, uMin + u * (uMax - uMin), vMin + v * (vMax - vMin))
  }
  uvs.needsUpdate = true

  // Organic 3D petal curvature (cupping & tip curl)
  const halfW = width * 0.5
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const nx = x / halfW // -1 to 1
    const ny = (y + height * 0.5) / height // 0 to 1

    // Transverse spoon cupping + longitudinal arc
    const cup = (nx * nx) * (width * 0.2)
    const curl = Math.sin(ny * Math.PI) * (height * 0.12)
    pos.setZ(i, cup + curl)
  }

  geom.computeVertexNormals()
  return geom
}

/**
 * Creates a single curved petal geometry using the full 0..1 UV range
 * (for sakura_petal.png).
 */
export function createSinglePetalGeometry(
  width = 0.15,
  height = 0.20
): THREE.PlaneGeometry {
  const geom = new THREE.PlaneGeometry(width, height, 5, 5)
  const pos = geom.attributes.position
  const halfW = width * 0.5

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const nx = x / halfW
    const ny = (y + height * 0.5) / height
    const cup = (nx * nx) * (width * 0.2)
    const curl = Math.sin(ny * Math.PI) * (height * 0.12)
    pos.setZ(i, cup + curl)
  }

  geom.computeVertexNormals()
  return geom
}

/**
 * Clean natural tints preserving 2cfe4ec598247f1aafa06d4560ed570c.png authentic pink tones
 */
export const SAKURA_TINTS = [
  new THREE.Color('#ffffff'), // 100% authentic reference pink
  new THREE.Color('#ffffff'), // Repeated for dominant natural look
  new THREE.Color('#fff7f9'), // Warm bright highlight
  new THREE.Color('#fff0f4'), // Soft blush
  new THREE.Color('#ffedf3'), // Tender rose tint
  new THREE.Color('#ffe5ee')  // Pastel sunset kiss
]

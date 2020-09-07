/**    /\
 *    /_\
 *  /___\
 */
import { rnd, setColor, sum } from "../utils"

export const geo = (x = 0, z = 0) => {
  let geo = new THREE.Geometry()
  let length = rnd(4, 6)
  let h = Array.from({ length }, () => rnd(2, 4))

  for (let i = 0; i < length - 2; i++) {
    let level = new THREE.ConeGeometry(1.5 + i * 0.5, h.pop(), 8)
    setColor(level, 0x009900)
    level.translate(0, sum(h) - h.length, 0)
    geo.merge(level)
  }

  let trunk = new THREE.CylinderGeometry(0.5, 0.5, h.pop())
  setColor(trunk, 0x0b0e02)
  trunk.translate(0, 0, 0)
  geo.merge(trunk)

  geo.translate(x, 0, z)
  return geo
}

export const mat = () => new THREE.MeshToonMaterial({ color: "#d5ff80", vertexColors: true })

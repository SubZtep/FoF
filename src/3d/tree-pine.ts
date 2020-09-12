/**    /\
 *    /_\
 *  /___\
 */
import { rnd, setColor, sum } from "../utils"

AFRAME.registerGeometry("pine", {
  init() {
    let geo = new THREE.Geometry(),
      length = rnd(4, 6),
      h = Array.from({ length }, () => rnd(2, 4)),
      c1 = new THREE.Color(0x009900),
      c2 = new THREE.Color(0x0b0e02),
      i: number

    c1.convertSRGBToLinear()
    c2.convertSRGBToLinear()

    for (i = 0; i < length - 2; i++) {
      let level = new THREE.ConeGeometry(1.5 + i * 0.5, h.pop(), 8)
      setColor(level, c1)
      level.translate(0, sum(h) - h.length, 0)
      geo.merge(level)
    }

    let trunk = new THREE.CylinderGeometry(0.5, 0.5, h.pop())
    setColor(trunk, c2)
    trunk.translate(0, 0, 0)
    geo.merge(trunk)

    this.geometry = geo
  },
})

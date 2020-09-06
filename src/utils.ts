import * as AFrame from "aframe"
import { Face3 } from "super-three/src/core/Face3"

export const rnd = (min: number, max: number) => Math.random() * (min - max) + max

export const loadEntity = async (name: string, parent: AFrame.Entity) => {
  const res = await fetch(`entities/${name}.html`)
  parent.insertAdjacentHTML("beforeend", await res.text())
}

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)

export const setColor = (geo: THREE.Geometry, color: THREE.Color | number) => {
  // geo.faces.forEach(f => f.color.set(color))
  let f: Face3
  for (f of geo.faces) {
    f.color.set(color)
  }
}

/**
 * remap value from the range of [smin,smax] to [emin,emax]
 */
export const map = (val: number, smin: number, smax: number, emin: number, emax: number) =>
  ((emax - emin) * (val - smin)) / (smax - smin) + emin

/**
 * randomly displace the x,y,z coords by the `per` value
 */
export const jitter = (geo: THREE.Geometry, per: number) =>
  geo.vertices.forEach(v => {
    v.x += map(Math.random(), 0, 1, -per, per)
    v.y += map(Math.random(), 0, 1, -per, per)
    v.z += map(Math.random(), 0, 1, -per, per)
  })

export const chopBottom = (geo: THREE.Geometry, bottom: number) =>
  geo.vertices.forEach(v => (v.y = Math.max(v.y, bottom)))

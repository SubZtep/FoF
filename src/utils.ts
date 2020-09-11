import { Entity } from "aframe"
import { Face3 } from "super-three/src/core/Face3"

export const rnd = (min: number, max: number) => Math.random() * (min - max) + max

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)

export const setColor = (geo: THREE.Geometry, color: THREE.Color | number) => {
  let f: Face3
  for (f of geo.faces) {
    f.color.set(color)
  }
}

export const addMixin = (el: Entity) => (name: string) => {
  el.setAttribute("mixin", `${el.getAttribute("mixin") || ""} ${name}`.trimLeft())
  return el
}

export const delMixin = (el: Entity) => (name: string) => {
  let m = el.getAttribute("mixin") || ""
  el.setAttribute(
    "mixin",
    m
      .split(" ")
      .filter(m => m !== name)
      .join(" ")
  )
  return el
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

export const random = (x: number, seed = 8) =>
  parseFloat(
    "0." +
      Math.sin(seed * 9999 * x)
        .toString()
        .substr(7)
  )

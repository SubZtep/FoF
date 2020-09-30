import { Entity } from "aframe"
import { Face3 } from "super-three/src/core/Face3"

/** Real number */
export const rnd = (min: number, max: number) => Math.random() * (min - max) + max

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0)

export const setColor = (geo: THREE.Geometry, color: THREE.Color | number) => {
  let f: Face3
  for (f of geo.faces) {
    f.color.set(color)
  }
}

export const addMixin = (el: Entity) => (...names: string[]) => {
  let m = el.getAttribute("mixin") || ""
  el.setAttribute("mixin", [...new Set([...m.split(" "), ...names])].join(" "))
  return delMixin(el)
}

export const delMixin = (el: Entity) => (...names: string[]) => {
  let m = el.getAttribute("mixin") || ""
  el.setAttribute(
    "mixin",
    m
      .split(" ")
      .filter((m: string) => !names.includes(m))
      .join(" ")
  )
  return addMixin(el)
}

export const clearMixins = (el: Entity) => {
  el.setAttribute("mixin", "")
}

export const setText = (el?: Entity) => (value: string) => {
  el.setAttribute("text", "value", value || "")
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

export const delEls = (sel: string) => {
  let all = document.querySelectorAll(sel) as NodeListOf<Entity>,
    len = all.length,
    el: Entity,
    i: number
  for (i = 0; i < len; i++) {
    el = all[i]
    el.parentNode?.removeChild(el)
    el.destroy()
  }
}

import * as AFrame from "aframe"

export const rnd = (min: number, max: number) => Math.random() * (min - max) + max

export const loadEntity = async (name: string, parent: AFrame.Entity) => {
  const res = await fetch(`entities/${name}.html`)
  parent.insertAdjacentHTML("beforeend", await res.text())
}

export const nearestValue = (arr: number[], val: number) =>
  arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val

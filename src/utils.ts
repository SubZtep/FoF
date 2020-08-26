import * as AFrame from "aframe"

export const rnd = (min: number, max: number) => Math.random() * (min - max) + max

export const getEntity = async (name: string, scene?: AFrame.Scene) => {
  const res = await fetch(`entities/${name}.html`)
  const data = await res.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, "text/html")

  if (scene) {
    doc.body.childNodes.forEach(el => void scene.appendChild(el))
  }

  return doc.body.childNodes
}

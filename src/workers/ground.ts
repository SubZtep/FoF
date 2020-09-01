import { GroundWorkerMessage } from "../types"

let vertices: THREE.Vector3[]

const nearestValue = (arr: number[], val: number) =>
  arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val

self.onmessage = ({ data }: MessageEvent<GroundWorkerMessage>) => {
  switch (data.cmd) {
    case "vertices":
      vertices = data.payload
      break
    case "q":
      const { id, pos } = data.payload
      let x = nearestValue(
        vertices.map(v => v.x),
        pos.x
      )
      let y = nearestValue(
        vertices.map(v => v.y),
        pos.z
      )

      let vpos = vertices.find(v => v.x === x && v.y === y)

      // Scale value (2) from ground.ts, 0.2 meter in the soil.
      // @ts-ignore
      self.postMessage({
        id,
        pos: [vpos.x, vpos.z, vpos.y],
        // pos: [vpos.x, vpos.z * 1.5 - 0.2, vpos.y],
      })
  }
}

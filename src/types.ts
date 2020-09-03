declare global {
  var THREE: typeof THREE
}

export type ControllerInput = {
  axis: number[]
  changed: boolean[]
}

export type GroundWorkerMessage = {
  cmd: "vertices" | "q"
  payload: any
}

export type PlayerRayCol = {
  enabled?: boolean
  direction?: THREE.Vector3
}

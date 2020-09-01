export type ControllerInput = {
  axis: number[]
  changed: boolean[]
}

export type GroundWorkerMessage = {
  cmd: "vertices" | "q"
  payload: any
}

declare global {
  var THREE: typeof THREE
}

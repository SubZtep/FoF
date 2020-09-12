import { Entity } from "aframe"
import { Object3D } from "super-three/src/core/Object3D"

declare global {
  var THREE: typeof THREE
}

export type Hand = "left" | "right"

export type ControllerMap = {
  axes: {
    /** one of buttons */
    [key: string]: number[]
  }
  buttons: string[]
}

export type InputMapping = {
  left: ControllerMap
  right: ControllerMap
}

export type ButtonDetail = {
  id: number
  state: {
    pressed: boolean
    touched: boolean
    value: number
  }
}

export type AxisDetail = {
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

export type EmulatedKeys = {
  KeyW?: number
  KeyS?: number
  KeyA?: number
  KeyD?: number
}

export interface AObject3D extends Object3D {
  el?: Entity
  children: AObject3D[]
}

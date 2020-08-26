import { DetailEvent } from "aframe"
import { ControllerInput } from "../types"

AFRAME.registerComponent("vr-wasd", {
  init() {
    this.rig = document.querySelector("#rig")
    if (this.rig.hasLoaded) {
      this.addControls()
    } else {
      this.rig.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  move(e: DetailEvent<ControllerInput>) {
    const wasd = this.rig.components["wasd-controls"]
    const [axisX, axisY] = e.detail.axis
    const keys: { [key: string]: any } = {}

    if (axisY < 0) {
      keys.KeyW = 1
    } else if (axisY > 0) {
      keys.KeyS = 1
    }

    if (axisX < 0) {
      keys.KeyA = 1
    } else if (axisX > 0) {
      keys.KeyD = 1
    }
    wasd.data.acceleration = Math.max(Math.abs(axisY), Math.abs(axisX)) * 200
    wasd.keys = keys
  },

  addControls() {
    this.el.addEventListener("axismove", this.move.bind(this))
  },

  remove() {
    this.el.removeEventListener("axismove", this.move)
  },
})

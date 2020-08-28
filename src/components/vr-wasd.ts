import { DetailEvent } from "aframe"
import { ControllerInput } from "../types"

AFRAME.registerComponent("vr-wasd", {
  schema: {
    velocity: {
      type: "number",
      default: 120,
    },
    run: {
      type: "number",
      default: 2, // multiplier
    },
  },

  init() {
    this.state = {
      trigger: false,
    }
    this.rig = document.querySelector("#rig")
    if (this.rig.hasLoaded) {
      this.addControls()
    } else {
      this.rig.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  move(e: DetailEvent<ControllerInput>) {
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
    this.wasd.data.acceleration =
      Math.max(Math.abs(axisY), Math.abs(axisX)) * (this.data.velocity * (this.state.trigger ? this.data.run : 1))
    this.wasd.keys = keys
  },

  addControls() {
    this.wasd = this.rig.components["wasd-controls"]
    this.el.addEventListener("axismove", this.move.bind(this))
    this.el.addEventListener("triggerdown", () => {
      this.state.trigger = true
    })
    this.el.addEventListener("triggerup", () => {
      this.state.trigger = false
    })
  },

  remove() {
    this.el.removeEventListener("axismove", this.move)
  },
})

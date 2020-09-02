import { DetailEvent } from "aframe"
import { ControllerInput } from "../../types"

AFRAME.registerComponent("wasd-vr", {
  schema: {
    velocity: {
      type: "number",
      default: 120,
    },
    run: {
      type: "number",
      default: 2, // multiplier
    },
    target: {
      type: "selector",
      default: "#player",
    },
  },

  init() {
    this.state = {
      trigger: false,
    }
    if (this.data.target.hasLoaded) {
      this.addControls()
    } else {
      this.data.target.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  move(e: DetailEvent<ControllerInput>) {
    let a = e.detail.axis,
      i = a.length === 4 ? 2 : 0,
      axisX = a[i++],
      axisY = a[i]

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
    this.wasd = this.data.target.components["wasd-controls"]
    this.el.addEventListener("axismove", this.move.bind(this))
    this.el.addEventListener("triggerdown", () => {
      this.state.trigger = true
    })
    this.el.addEventListener("triggerup", () => {
      this.state.trigger = false
    })

    // Raycast obsticles
    this.el.addEventListener("raycaster", evt => {
      console.log(evt)
    })
  },

  remove() {
    this.el.removeEventListener("axismove", this.move)
  },
})

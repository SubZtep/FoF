/**
 * VR controller movement using "wasd-control" component by faking pressed keys
 *
 * Entity state: run
 */
import { DetailEvent, Entity } from "aframe"
import { ControllerInput } from "../../types"

type EmulatedKeys = {
  KeyW?: number
  KeyS?: number
  KeyA?: number
  KeyD?: number
}

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
    player: {
      type: "selector",
      default: "#player",
    },
  },

  init() {
    if (this.data.player.hasLoaded) {
      this.addControls()
    } else {
      this.data.player.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  move(e: DetailEvent<ControllerInput>) {
    let a = e.detail.axis,
      i = a.length === 4 ? 2 : 0,
      axisX = a[i++],
      axisY = a[i],
      keys: EmulatedKeys = {}

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
      Math.max(Math.abs(axisY), Math.abs(axisX)) * (this.data.velocity * (this.el.is("run") ? this.data.run : 1))
    this.wasd.keys = keys
  },

  addControls() {
    let el: Entity = this.el
    this.wasd = this.data.player.components["wasd-controls"]
    el.addEventListener("axismove", this.move.bind(this))
    el.addEventListener("triggerdown", () => el.addState("run"))
    el.addEventListener("triggerup", () => el.removeState("run"))
  },
})

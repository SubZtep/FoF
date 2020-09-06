/**
 * Rotate player with axis move
 */
import { DetailEvent } from "aframe"
import { ControllerInput } from "../../types"

AFRAME.registerComponent("turn-vr", {
  schema: {
    angle: {
      type: "number",
      default: Math.PI / 5,
    },
    player: {
      type: "selector",
      default: "#player",
    },
  },

  init() {
    this.lastRotate = 0
    if (this.data.player.hasLoaded) {
      this.addControls()
    } else {
      this.data.player.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  turn(e: DetailEvent<ControllerInput>) {
    let a = e.detail.axis,
      i = a.length === 4 ? 2 : 0 // Chrome's axis array has 4 items
    let sign = Math.sign(a[i])
    if (sign !== this.lastRotate) {
      this.lastRotate = sign
      this.data.player.object3D.rotation.y -= sign * this.data.angle
    }
  },

  addControls() {
    this.el.addEventListener("axismove", this.turn.bind(this))
  },

  remove() {
    this.el.removeEventListener("axismove", this.turn)
  },
})

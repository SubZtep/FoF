import { DetailEvent } from "aframe"
import { ControllerInput } from "../../types"

AFRAME.registerComponent("rotate-vr", {
  schema: {
    angle: {
      type: "number",
      default: Math.PI / 5,
    },
    target: {
      type: "selector",
      default: "#player",
    },
  },

  init() {
    this.lastRotate = 0
    if (this.data.target.hasLoaded) {
      this.addControls()
    } else {
      this.data.target.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  rotate(e: DetailEvent<ControllerInput>) {
    let a = e.detail.axis,
      i = a.length === 4 ? 2 : 0
    let sign = Math.sign(a[i])
    if (sign !== this.lastRotate) {
      this.lastRotate = sign
      this.data.target.object3D.rotation.y -= sign * this.data.angle
    }
  },

  addControls() {
    this.el.addEventListener("axismove", this.rotate.bind(this))
  },

  remove() {
    this.el.removeEventListener("axismove", this.rotate)
  },
})

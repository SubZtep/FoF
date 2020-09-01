import { DetailEvent } from "aframe"
import { ControllerInput } from "../types"

AFRAME.registerComponent("vr-rotate", {
  schema: {
    angle: {
      type: "number",
      default: Math.PI / 5,
    },
  },

  init() {
    this.lastRotate = 0
    this.rig = document.querySelector("#rig")
    if (this.rig.hasLoaded) {
      this.addControls()
    } else {
      this.rig.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  rotate(e: DetailEvent<ControllerInput>) {
    let a = e.detail.axis,
      i = a.length === 4 ? 2 : 0
    let sign = Math.sign(a[i])
    if (sign !== this.lastRotate) {
      this.lastRotate = sign
      this.rig.object3D.rotation.y -= sign * this.data.angle
    }
  },

  addControls() {
    this.el.addEventListener("axismove", this.rotate.bind(this))
  },

  remove() {
    this.el.removeEventListener("axismove", this.rotate)
  },
})

import { DetailEvent } from "aframe"
import { ControllerInput } from "../types"

AFRAME.registerComponent("vr-rotate", {
  init() {
    this.rig = document.querySelector("#rig")
    if (this.rig.hasLoaded) {
      this.addControls()
    } else {
      this.rig.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  rotate(e: DetailEvent<ControllerInput>) {
    this.rig.object3D.rotation.y -= e.detail.axis[0] * 0.02
  },

  addControls() {
    this.el.addEventListener("axismove", this.rotate.bind(this))
  },

  remove() {
    this.el.removeEventListener("axismove", this.rotate)
  },
})

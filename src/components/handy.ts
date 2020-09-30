/**
 * Component affected by hand
 *
 * Component state: intersect, hold
 */

import { DetailEvent, Entity } from "aframe"
import { addMixin, delMixin } from "../utils"

AFRAME.registerComponent("handy", {
  /** 0: Off, 1: Intersected */
  hands: {
    left: 0,
    right: 0,
  },

  play() {
    let { el } = this
    el.addEventListener("raycaster-intersected", this.rayIn.bind(this))
    el.addEventListener("raycaster-intersected-cleared", this.rayOut.bind(this))
    el.addEventListener("hand", this.inHand.bind(this))
    el.addEventListener("stateadded", this.setMixins.bind(this))
    el.addEventListener("stateremoved", this.setMixins.bind(this))
    this.setMixins()
  },

  pause() {
    let { el } = this
    el.removeEventListener("raycaster-intersected", this.rayIn)
    el.removeEventListener("raycaster-intersected-cleared", this.rayOut)
    el.removeEventListener("hand", this.inHand)
    el.removeEventListener("stateadded", this.setMixins)
    el.removeEventListener("stateremoved", this.setMixins)
  },

  setMixins() {
    let { el } = this
    let m
    if (el.is("hold")) {
      el.object3D.scale.set(1, 1, 1)
      m = delMixin(el)
      m("pulse")
      m("fastanim")
    } else {
      m = addMixin(el)
      m("pulse")
      if (el.is("intersect")) m("fastanim")
    }
  },

  inHand({ detail }: DetailEvent<boolean>) {
    this.el[detail ? "addState" : "removeState"]("hold")
  },

  rayIn({ detail }: DetailEvent<{ el: Entity }>) {
    let hc = detail.el.components["hand-controls"]
    if (hc) {
      this.hands[hc.data.hand] = 1
      this.el.addState("intersect")
    }
  },

  rayOut({ detail }: DetailEvent<{ el: Entity }>) {
    let hc = detail.el.components["hand-controls"]
    if (hc) {
      this.hands[hc.data.hand] = 0
      if (this.hands.left === 0 && this.hands.right === 0) {
        this.el.removeState("intersect")
      }
    }
  },
})

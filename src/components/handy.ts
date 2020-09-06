/**
 * Component affected by hand
 *
 * Component state: intersect, hold
 */

import { DetailEvent, Entity } from "aframe"

AFRAME.registerComponent("handy", {
  /** 0: Off, 1: Intersected */
  hands: {
    left: 0,
    right: 0,
  },

  init() {
    let el = this.el

    const setMixins = () => {
      if (el.is("hold")) {
        el.object3D.scale.set(1, 1, 1)
        el.removeAttribute("mixin")
      } else {
        el.setAttribute("mixin", `pulse${el.is("intersect") ? " opacity" : ""}`)
      }
    }

    el.addEventListener("raycaster-intersected", (evt: DetailEvent<{ el: Entity }>) => {
      let hc = evt.detail.el.components["hand-controls"]
      if (hc) {
        this.hands[hc.data.hand] = 1
        el.addState("intersect")
      }
    })

    el.addEventListener("raycaster-intersected-cleared", ({ detail }: DetailEvent<{ el: Entity }>) => {
      let hc = detail.el.components["hand-controls"]
      if (hc) {
        this.hands[hc.data.hand] = 0
        if (this.hands.left === 0 && this.hands.right === 0) {
          el.removeState("intersect")
        }
      }
    })

    el.addEventListener("hand", ({ detail }: DetailEvent<boolean>) => {
      if (detail) {
        el.addState("hold")
      } else {
        el.removeState("hold")
      }
    })

    el.addEventListener("stateadded", setMixins)
    el.addEventListener("stateremoved", setMixins)
    setMixins()
  },
})

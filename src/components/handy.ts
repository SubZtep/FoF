/**
 * Component affected by hand
 *
 * Component state: intersect, hold
 */

import { DetailEvent } from "aframe"

AFRAME.registerComponent("handy", {
  /** 0: Off, 1: Intersected, 2: Hold */
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

    el.addEventListener("raycaster-intersected", ({ detail }) => {
      this.hands[detail.el.components["hand-controls"].data.hand] = 1
      el.addState("intersect")
    })

    el.addEventListener("raycaster-intersected-cleared", ({ detail }) => {
      this.hands[detail.el.components["hand-controls"].data.hand] = 0
      if (this.hands.left === 0 && this.hands.right === 0) {
        el.removeState("intersect")
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
  },
})

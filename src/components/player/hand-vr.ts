/**
 * Hand grap objects in VR.
 *
 * Entity state: grip
 */

import { Entity } from "aframe"
import { Intersection } from "super-three/src/core/Raycaster"

AFRAME.registerComponent("hand-vr", {
  dependencies: ["raycaster"],
  // dependencies: ["raycaster", "hand-controls"], // if "hand" required
  // this.el.components["hand-controls"].data.hand // "left" | "right"

  schema: {
    player: {
      type: "selector",
      default: "#player",
    },
  },

  intersections: [],
  uuids: [], // object(s) in hand

  init() {
    this.raycaster = this.el.components.raycaster
  },

  play() {
    let el: Entity = this.el

    el.addEventListener("raycaster-intersection", () => (this.intersections = this.raycaster.intersections))
    el.addEventListener("raycaster-intersection-cleared", () => (this.intersections = []))
    el.addEventListener("gripup", () => el.removeState("grip")) // open
    el.addEventListener("gripdown", () => el.addState("grip")) // close

    el.addEventListener("stateadded", () => {
      if (el.is("grip")) {
        this.intersections.forEach((intersection: Intersection | any) => {
          let child = intersection.object.parent.el.object3D
          this.uuids.push(child.uuid)
          el.object3D.attach(child) // copy position and rotation
        })
      }
    })

    el.addEventListener("stateremoved", () => {
      if (!el.is("grip")) {
        let i = this.uuids.length
        while (i--) {
          let child = el.object3D.children.find(obj3d => obj3d.uuid === this.uuids[i])
          if (child) {
            this.uuids.splice(i, 1)
            el.sceneEl.object3D.attach(child) // copy position and rotation
          }
        }
      }
    })
  },
})

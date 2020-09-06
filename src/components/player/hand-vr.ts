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

  schema: {
    player: {
      type: "selector",
      default: "#player",
    },
  },

  intersections: [],
  uuids: [], // object(s) in hand

  init() {
    // this.el.components["hand-controls"].data.hand // "left" | "right"
    this.raycaster = this.el.components.raycaster
  },

  play() {
    let el: Entity = this.el

    el.addEventListener(
      "raycaster-intersection",
      () => {
        console.log("HANDHIITTTT")
        this.intersections = this.raycaster.intersections
      },
      false
    )
    el.addEventListener("raycaster-intersection-cleared", () => (this.intersections = []), false)
    el.addEventListener("gripup", () => el.removeState("grip")) // open
    el.addEventListener("gripdown", () => el.addState("grip")) // close

    el.addEventListener("stateadded", () => {
      if (el.is("grip")) {
        this.intersections.forEach((intersection: Intersection | any) => {
          let child = intersection.object.parent.el.object3D
          this.uuids.push(child.uuid)

          // copy position
          // el.object3D.add(child)
          // child.position.set(0, 0, 0)
          el.object3D.attach(child)
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

            // copy position
            // el.sceneEl.object3D.add(child)
            // child.position.copy(el.object3D.position).add(this.data.player.object3D.position)
            el.sceneEl.object3D.attach(child)
          }
        }
      }
    })
  },
})

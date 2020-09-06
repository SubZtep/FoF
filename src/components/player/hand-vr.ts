/**
 * Hand grap objects in VR.
 *
 * Entity state: grip
 */

import { DetailEvent, Entity } from "aframe"
import { Intersection } from "super-three/src/core/Raycaster"

AFRAME.registerComponent("hand-vr", {
  dependencies: ["raycaster"],

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

    el.addEventListener("stateadded", ({ detail }: DetailEvent<string>) => {
      switch (detail) {
        case "hold":
          let int: Intersection | any
          for (int of this.intersections) {
            let child = int.object.parent.parent.el.object3D
            this.uuids.push(child.uuid)
            el.object3D.attach(child) // copy position and rotation
            //TODO: better base then `children[0]`
            child.children[0].el.emit("hand", true)
          }
          break
        case "exe":
          let a
          for (a of el.object3D.children) {
            if (this.uuids.includes(a.uuid)) {
              a.el.addState("exe")
            }
          }
          break
      }
    })

    el.addEventListener("stateremoved", ({ detail }: DetailEvent<string>) => {
      switch (detail) {
        case "hold":
          let i = this.uuids.length
          while (i--) {
            let child = el.object3D.children.find(obj3d => obj3d.uuid === this.uuids[i])
            if (child) {
              this.uuids.splice(i, 1)
              el.sceneEl.object3D.attach(child) // copy position and rotation
              /// @ts-ignore
              child.children[0].el.emit("hand", false)
            }
          }
          break
        case "exe":
          let a
          for (a of el.object3D.children) {
            if (this.uuids.includes(a.uuid)) {
              a.el.removeState("exe")
            }
          }
          break
      }
    })
  },
})

import { Intersection } from "super-three/src/core/Raycaster"

//====
//|| Entity State: grip
//==

AFRAME.registerComponent("hand-vr", {
  dependencies: ["raycaster", "hand-controls"],

  schema: {
    hand: {
      default: "left",
      oneOf: ["left", "right"],
    },
    target: {
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
    let el = this.el
    el.addEventListener("raycaster-intersection", () => {
      this.intersections = this.raycaster.intersections
    })
    el.addEventListener("raycaster-intersection-cleared", () => {
      this.intersections = []
    })
    el.addEventListener("gripup", () => {
      el.removeState("grip")
    }) // open
    el.addEventListener("gripdown", () => {
      el.addState("grip")
    }) // close
    el.addEventListener("stateadded", () => {
      if (el.is("grip")) {
        this.intersections.forEach((intersection: Intersection | any) => {
          let child = intersection.object.parent.el.object3D
          this.uuids.push(child.uuid)
          el.object3D.add(child)
          child.position.set(0, 0, 0)
        })
      }
    })
    el.addEventListener("stateremoved", () => {
      if (!el.is("grip")) {
        let i = this.uuids.length
        while (i--) {
          let child = el.object3D.children.find(obj3d => obj3d.uuid === this.uuids[i])
          if (child) {
            el.sceneEl.object3D.add(child)
            child.position.copy(el.object3D.position).add(this.data.target.object3D.position)
            this.uuids.splice(i, 1)
          }
        }
      }
    })
  },
})

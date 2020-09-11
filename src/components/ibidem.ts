import { Vector3 } from "super-three/src/math/Vector3"

const comp = (obj1: Vector3, obj2: Vector3, tolerance: number) =>
  Math.abs(obj1.x - obj2.x) < tolerance &&
  Math.abs(obj1.y - obj2.y) < tolerance &&
  Math.abs(obj1.z - obj2.z) < tolerance

/**
 * Trigger event if "this" object is (about) the same place and rotation as in schema
 */
AFRAME.registerComponent("ibidem", {
  schema: {
    target: {
      type: "selector",
      default: "#tutaim",
    },
    posTolerance: {
      default: 0.2,
    },
    rotTolerance: {
      default: 0.5,
    },
  },

  init() {
    this.tick = AFRAME.utils.throttleTick(this.tick, 100, this)
  },

  tick() {
    let { el, data } = this
    if (
      comp(el.object3D.position, data.target.object3D.position, data.posTolerance) &&
      comp(el.object3D.rotation, data.target.object3D.rotation, data.rotTolerance)
    ) {
      el.emit("introDone")
    }
  },
})

import { Vector3 } from "super-three/src/math/Vector3"

/**
 * Stop movement toward obsticles
 */
AFRAME.registerComponent("obstacle-stop", {
  dependencies: ["raycaster"],

  schema: {
    target: {
      type: "selector",
      default: "#player",
    },
    dirY: {
      default: 2,
    },
  },

  zm: () => new THREE.Vector3(),
  o: null,
  d: null,

  play() {
    this.wasd = this.data.target.components["wasd-controls"]
    this.om = this.wasd.getMovementVector
    this.el.addEventListener("raycaster-intersection", this.stopMove.bind(this))
    this.el.addEventListener("raycaster-intersection-cleared", this.startMove.bind(this))
  },

  pause() {
    this.wasd = undefined
    this.el.removeEventListener("raycaster-intersection", this.stopMove)
    this.el.removeEventListener("raycaster-intersection-cleared", this.startMove)
  },

  stopMove() {
    //FIXME: if too slow could miss coz jump (make longer ray and calculate distance)
    this.wasd.getMovementVector = this.zm
  },

  startMove() {
    this.wasd.getMovementVector = this.om
  },

  tick() {
    if (!this.wasd) return
    let velocity = this.wasd.velocity
    if (velocity.x !== 0 || velocity.z !== 0) {
      // Turn raycaster toward the direction of walking
      this.o = velocity.clone()
      this.o.normalize().divideScalar(4) as Vector3
      this.d = this.o.clone()
      this.d.divideScalar(2) as Vector3
      this.d.y = this.data.dirY
      this.el.setAttribute("raycaster", { origin: this.o, direction: this.d })
    }
  },
})

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
    diry: {
      default: 2,
    },
  },

  init() {
    if (this.data.target.hasLoaded) {
      this.addControls()
    } else {
      this.data.target.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
    // this.el.addEventListener("componentinitialized", evt => {
    //   console.log("EEEE", evt.detail)
    // })
  },

  addControls() {
    this.wasd = this.data.target.components["wasd-controls"]
    let om = this.wasd.getMovementVector
    let zm = () => new THREE.Vector3()

    this.el.addEventListener("raycaster-intersection", () => {
      //FIXME: if too slow could miss coz jump (make longer ray and calculate distance)
      this.wasd.getMovementVector = zm
    })
    this.el.addEventListener("raycaster-intersection-cleared", () => {
      this.wasd.getMovementVector = om
    })
  },

  o: null,
  d: null,

  tick() {
    if (!this.wasd) return
    let velocity = this.wasd.velocity
    if (velocity.x !== 0 || velocity.z !== 0) {
      this.o = velocity.clone()
      this.o.normalize().divideScalar(4) as Vector3
      this.d = this.o.clone()
      this.d.divideScalar(2) as Vector3
      this.d.y = this.data.diry
      this.el.setAttribute("raycaster", { origin: this.o, direction: this.d })
    }
  },
})

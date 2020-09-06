/**
 * Stop movement toward obsticles
 */
AFRAME.registerComponent("obstacle-stop", {
  dependencies: ["raycaster", "wasd-controls"],

  init() {
    this.wasd = this.el.components["wasd-controls"]
    let om = this.wasd.getMovementVector
    let zm = () => new THREE.Vector3()

    this.el.addEventListener("raycaster-intersection", () => {
      // A-Frame raycast always recursive, will pickup hand's intersections
      this.wasd.getMovementVector = zm
    })
    this.el.addEventListener("raycaster-intersection-cleared", () => {
      this.wasd.getMovementVector = om
    })
  },

  tick() {
    let velocity = this.wasd.velocity
    if (velocity.x !== 0 || velocity.z !== 0) {
      let origin = velocity.clone().normalize().divideScalar(3)
      let direction = origin.clone().divideScalar(2)
      direction.y = 2
      this.el.setAttribute("raycaster", { origin, direction })
    }
  },
})

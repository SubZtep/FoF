/**
 * Stop movement toward obsticles
 */
AFRAME.registerComponent("obstacle-stop", {
  dependencies: ["raycaster"],

  schema: {
    player: {
      type: "selector",
      default: "#player",
    },
  },

  init() {
    if (this.data.player.hasLoaded) {
      this.addControls()
    } else {
      this.data.player.addEventListener("loaded", this.addControls.bind(this), { once: true })
    }
  },

  addControls() {
    this.wasd = this.data.player.components["wasd-controls"]
    let om = this.wasd.getMovementVector
    let zm = () => new THREE.Vector3()

    this.el.addEventListener("raycaster-intersection", () => {
      this.wasd.getMovementVector = zm
    })
    this.el.addEventListener("raycaster-intersection-cleared", () => {
      this.wasd.getMovementVector = om
    })
  },

  tick() {
    let velocity = this.wasd.velocity
    if (velocity.x !== 0 || velocity.z !== 0) {
      let origin = velocity.clone().normalize().divideScalar(4)
      let direction = origin.clone().divideScalar(2)
      direction.y = 2
      this.el.setAttribute("raycaster", { origin, direction })
    }
  },
})

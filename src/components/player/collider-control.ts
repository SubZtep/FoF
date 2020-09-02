// import { Intersection } from "super-three/src/core/Raycaster"

AFRAME.registerComponent("collider-control", {
  dependencies: ["raycaster", "wasd-controls"],

  init() {
    this.wasd = this.el.components["wasd-controls"]
    this.raycaster = this.el.components.raycaster

    this.el.addEventListener("raycaster-intersection", () => {
      this.wasd.pause()
      // this.intersections = this.raycaster.intersections
    })
    this.el.addEventListener("raycaster-intersection-cleared", () => {
      this.wasd.play()
      // this.intersections = null
    })
  },

  tick() {
    // Set raycast direction
    let velocity = this.wasd.velocity
    if (velocity.x !== 0 || velocity.z !== 0) {
      let direction = velocity.clone().normalize().divideScalar(2)
      direction.y = 1.5
      this.el.setAttribute("raycaster", { direction })
    }

    // if (this.intersections) {
    //   this.intersections.forEach((intersection: Intersection) => {
    //     //
    //   })
    // }
  },
})

// import { Intersection } from "super-three/src/core/Raycaster"
// import { PlayerRayCol } from "../../types"

AFRAME.registerComponent("obstacle-stop", {
  dependencies: ["raycaster", "wasd-controls"],

  init() {
    this.raycaster = this.el.components.raycaster
    this.wasd = this.el.components["wasd-controls"]

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
    // let raydata: PlayerRayCol = {}
    let velocity = this.wasd.velocity

    if (velocity.x !== 0 || velocity.z !== 0) {
      let direction = velocity.clone().normalize().divideScalar(2)
      direction.y = 1.5
      this.el.setAttribute("raycaster", { direction })
    }

    // let moving = velocity.x !== 0 || velocity.z !== 0
    // if (moving) {
    //   let direction = velocity.clone().normalize().divideScalar(2)
    //   direction.y = 1.5
    //   raydata.direction = direction
    // }
    // let on = this.intersections || moving
    // if (this.raycaster.data.enabled !== on) {
    //   raydata.enabled = on
    // }

    // if (Object.keys(raydata).length > 0) {
    //   this.el.setAttribute("raycaster", raydata)
    // }

    //TODO: let player go to the opposite direction from the intersected object
    // if (this.intersections) {
    //   this.intersections.forEach((intersection: Intersection) => {
    //     //
    //   })
    // }
  },
})

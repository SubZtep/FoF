AFRAME.registerComponent("rigid", {
  dependencies: ["raycaster"],

  init() {
    // console.log("JUHUUU init")
    // this.el.addEventListener("raycaster-intersection", e => {
    //   console.log("Player hit something!", e)
    // })
    // this.el.addEventListener("raycaster-intersected", evt => {
    //   console.log("JUHUUU CAST", evt)
    // })
    // this.el.addEventListener("raycaster-intersected-cleared", evt => {
    //   console.log("JUHUUU BOOO")
    // })
  },

  tick() {
    // console.log(this.el.components.raycaster.intersections)
    // console.log(this.el.components.raycaster.getIntersection(this.el))
  },
})

import { DetailEvent, Entity } from "aframe"

AFRAME.registerComponent("cursor-listener", {
  init: function () {
    let lastIndex = -1
    let COLORS = ["red", "green", "blue"]

    this.el.addEventListener("click", function (
      evt: DetailEvent<{ cursorEl: Entity; intersection: THREE.Intersection }>
    ) {
      console.log(evt)
      lastIndex = (lastIndex + 1) % COLORS.length
      this.setAttribute("material", "color", COLORS[lastIndex])
      console.log("I was clicked at: ", evt.detail.intersection.point)
    })
  },
})

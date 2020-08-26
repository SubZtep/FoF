import { nearestValue } from "../utils"

AFRAME.registerComponent("grounder", {
  dependencies: ["position"],

  init() {
    let ground = document.querySelector(".ground").object3D
    // @ts-ignore
    let groundVertices = ground.children[0].geometry.vertices
    let pos = this.el.object3D.position

    let x = nearestValue(
      groundVertices.map(v => v.x),
      pos.x
    )
    let y = nearestValue(
      groundVertices.map(v => v.y),
      pos.z
    )

    let vpos = groundVertices.find(v => v.x === x && v.y === y)
    this.el.object3D.position.set(vpos.x, vpos.z * ground.scale.z, vpos.y)
  },
})

import { geo, mat } from "../../3d/tree-pine"

AFRAME.registerComponent("tree-pine", {
  init() {
    let tree = new THREE.Mesh(geo(), mat())
    this.el.setObject3D("mesh", tree)
  },
})

// https://blog.mozvr.com/procedural-geometry-low-poly-clouds/
import { geo, mat } from "../../3d/tree-oak"

AFRAME.registerComponent("tree-oak", {
  init() {
    let tree = new THREE.Mesh(geo(), mat())
    this.el.setObject3D("mesh", tree)
  },
})

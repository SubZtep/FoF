import * as oak from "../3d/tree-oak"
import * as pine from "../3d/tree-pine"

AFRAME.registerComponent("forest", {
  schema: {
    treeCount: {
      type: "int",
      default: 100,
    },
    emptyWidth: {
      type: "number",
      default: 10,
    },
    forestWidth: {
      type: "number",
      default: 40,
    },
  },

  init() {
    const random = (x: number, seed = 8) => {
      return parseFloat(
        "0." +
          Math.sin(seed * 9999 * x)
            .toString()
            .substr(7)
      )
    }

    let oaks = new THREE.Geometry()
    let pines = new THREE.Geometry()

    for (let i = 0, r = 88343; i < this.data.treeCount; i++, r++) {
      let distance = this.data.emptyWidth + this.data.forestWidth * random(r + 1)
      let direction = random(r + 3) * Math.PI * 2

      let posX = Math.cos(direction) * distance
      let posY = Math.sin(direction) * distance

      if (posX < 0 && posY < 0) {
        pines.merge(pine.geo(posX, posY))
      } else {
        oaks.merge(oak.geo(posX, posY))
      }
    }

    this.el.setObject3D("oaks", new THREE.Mesh(oaks, oak.mat()))
    this.el.setObject3D("pines", new THREE.Mesh(pines, pine.mat()))
    this.el.object3D.matrixAutoUpdate = false
  },
})

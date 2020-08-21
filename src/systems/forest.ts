import { rnd } from "../utils"

AFRAME.registerSystem("forest", {
  schema: {
    stageSize: { type: "number", default: 100 }, // 200
    treeCount: { type: "number", default: 300 }, // 500
  },

  init() {
    let seed = 8

    const random = (x: number) => {
      return parseFloat(
        "0." +
          Math.sin(seed * 9999 * x)
            .toString()
            .substr(7)
      )
    }

    for (let i = 0, r = 88343; i < this.data.treeCount; i++, r++) {
      // set random position, rotation and scale
      let dv = new THREE.Vector3(10, 10, 10)

      // No trees on play area
      let distance = 10 + Math.max(dv.x, dv.z) + 10 * random(r + 1) + (random(r + 2) * this.data.stageSize) / 3
      let direction = random(r + 3) * Math.PI * 2

      let tree = document.createElement("a-tree")
      tree.object3D.position.set(Math.cos(direction) * distance, 0, Math.sin(direction) * distance)
      tree.object3D.scale.set(rnd(0.8, 1.2), rnd(0.8, 1.2), rnd(0.8, 1.2))

      document.querySelector("a-scene").appendChild(tree)
    }
  },
})

AFRAME.registerComponent("forest", {
  schema: {
    stageSize: {
      type: "number",
      default: 100 - 50,
    },
    treeCount: {
      type: "int",
      default: 100,
    },
  },

  update() {
    const random = (x: number, seed = 8) => {
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
      let posX = Math.cos(direction) * distance
      let posY = Math.sin(direction) * distance

      let tree = document.createElement("a-entity")
      // this.el.object3D.matrixAutoUpdate = false
      tree.setAttribute(posX < 0 && posY < 0 ? "tree-pine" : "tree-simple", "")
      tree.setAttribute("id", `t${i}`)
      tree.setAttribute("position", `${posX} 0 ${posY}`)
      tree.setAttribute("grounder", "")
      this.el.appendChild(tree)
    }
  },
})

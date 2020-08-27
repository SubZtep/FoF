AFRAME.registerSystem("forest", {
  deploy() {
    let stageSize = 200
    let treeCount = 300 // 500

    let seed = 8

    const random = (x: number) => {
      return parseFloat(
        "0." +
          Math.sin(seed * 9999 * x)
            .toString()
            .substr(7)
      )
    }

    for (let i = 0, r = 88343; i < treeCount; i++, r++) {
      // set random position, rotation and scale
      let dv = new THREE.Vector3(10, 10, 10)

      // No trees on play area
      let distance = 10 + Math.max(dv.x, dv.z) + 10 * random(r + 1) + (random(r + 2) * stageSize) / 3
      let direction = random(r + 3) * Math.PI * 2
      let posX = Math.cos(direction) * distance
      let posY = Math.sin(direction) * distance

      let tree = document.createElement("a-entity")
      tree.setAttribute(posX < 0 && posY < 0 ? "tree-pine" : "tree-simple", "")
      tree.setAttribute("id", `t${i}`)
      tree.setAttribute("position", `${posX} 0 ${posY}`)
      tree.setAttribute("grounder", "")
      tree.object3D.visible = false
      this.el.appendChild(tree)
    }
  },
})

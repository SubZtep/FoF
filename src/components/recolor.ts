/**
 * #ScaryTree: `material`: eye,`wood`: tree
 */
AFRAME.registerComponent("recolor", {
  init() {
    if (this.el.getObject3D("mesh") === undefined) {
      this.el.addEventListener("model-loaded", this.recolor.bind(this))
    } else {
      this.recolor()
    }
  },

  recolor() {
    const mesh = this.el.getObject3D("mesh")
    mesh.traverse(node => {
      if (node.isMesh) {
        node.material.color.setHex(0x000000)
        // node.material.color.setHex(0xffffff) // original
        if (node.material.name === "wood") {
          node.material.glossiness = 0
        }
      }
    })
  },
})

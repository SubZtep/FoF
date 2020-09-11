import { Entity } from "aframe"

AFRAME.registerComponent("xxxforest", {
  schema: {
    width: { default: 10 },
    gap: { default: 10 },
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

    let e: Entity,
      r = 88343,
      c = this.el.components
    while ((e = c.pool__oak.requestEntity() || c.pool__knot.requestEntity() || c.pool__pine.requestEntity())) {
      let distance = this.data.width + this.data.gap * random(++r + 1)
      let direction = random(r + 3) * Math.PI * 2

      let posX = Math.cos(direction) * distance
      let posY = Math.sin(direction) * distance

      // b = this.el.components.pool__kacsa.requestEntity()
      // @ts-ignore
      e.object3D.el.setAttribute("position", `${posX} 1 ${posY}`)
      e.play()

      // if (posX < 0 && posY < 0) {
      //   pines.merge(pine.geo(posX, posY))
      // } else {
      //   oaks.merge(oak.geo(posX, posY))
      // }
      // this.sceneEl.components.pool__kacsa.requestEntity()
    }

    // this.el.setObject3D("oaks", new THREE.Mesh(oaks, oak.mat()))
    // this.el.setObject3D("pines", new THREE.Mesh(pines, pine.mat()))
    // this.el.object3D.matrixAutoUpdate = false
  },
})

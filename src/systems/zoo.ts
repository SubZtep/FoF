import { Entity } from "aframe"
import { rnd } from "../utils"

AFRAME.registerSystem("zoo", {
  kacsas: [],

  kacsa() {
    let pool = this.el.components.pool__kacsa
    if (pool && pool.availableEls.length > 0) {
      let kacsa: Entity = this.el.components.pool__kacsa.requestEntity()
      kacsa.play()
      kacsa.object3D.position.set(rnd(-5, 5), rnd(-3, 6), rnd(-8, -2))
      this.kacsas.push(kacsa)
    }
  },
})

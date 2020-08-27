// https://blog.mozvr.com/procedural-geometry-low-poly-clouds/
import { chopBottom, jitter, rnd } from "../utils"

AFRAME.registerComponent("tree-simple", {
  init() {
    let trunkHeight = rnd(3, 4)

    const geo = new THREE.Geometry()

    const geoFoliage = new THREE.SphereGeometry(2.0, 7, 8)
    geoFoliage.faces.forEach(f => f.color.set(0x006400))
    geoFoliage.translate(0, trunkHeight, 0)
    geo.merge(geoFoliage)

    jitter(geoFoliage, 0.2)
    chopBottom(geoFoliage, -0.5)
    geoFoliage.computeFlatVertexNormals()

    let geoTrunk = new THREE.CylinderGeometry(rnd(0.1, 0.2), rnd(0.2, 0.3), trunkHeight, 32)
    geoTrunk.faces.forEach(f => f.color.set(0x2c1608))
    geoTrunk.translate(0, trunkHeight / 2, 0)
    geo.merge(geoTrunk)

    let tree = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
      })
    )
    tree.castShadow = true
    this.el.setObject3D("mesh", tree)
  },
})

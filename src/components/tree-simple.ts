// https://blog.mozvr.com/procedural-geometry-low-poly-clouds/
import { chopBottom, jitter, rnd, setColor } from "../utils"

AFRAME.registerComponent("tree-simple", {
  init() {
    let trunkHeight = rnd(4, 6)

    const geo = new THREE.Geometry()

    const geoFoliage = new THREE.SphereGeometry(2.0, 7, 8)
    setColor(geoFoliage, 0x006400)
    geoFoliage.translate(0, trunkHeight, 0)
    geo.merge(geoFoliage)

    jitter(geoFoliage, 0.2)
    chopBottom(geoFoliage, -0.5)
    geoFoliage.computeFlatVertexNormals()

    let geoTrunk = new THREE.CylinderGeometry(rnd(0.1, 0.3), rnd(0.2, 0.4), trunkHeight, 32)
    setColor(geoTrunk, 0x2c1608)
    geoTrunk.translate(0, trunkHeight / 2, 0)
    geo.merge(geoTrunk)

    let mat = new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true })
    let tree = new THREE.Mesh(geo, mat)
    this.el.setObject3D("mesh", tree)
  },
})

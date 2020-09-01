import { chopBottom, jitter, rnd, setColor } from "../utils"

export const geo = (x = 0, z = 0) => {
  let geo = new THREE.Geometry()
  let trunkHeight = rnd(7, 9)

  let geoFoliage = new THREE.SphereGeometry(2.0, 7, 8)
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

  geo.translate(x, 0, z)
  return geo
}

export const mat = () => new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true })

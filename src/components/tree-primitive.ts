import { rnd } from "../utils"

AFRAME.registerComponent("tree-primitive", {
  init() {
    let trunkHeight = rnd(3, 4)
    let trunkGeometry = new THREE.CylinderGeometry(rnd(0.1, 0.2), rnd(0.2, 0.3), trunkHeight, 32)
    let trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x2c1608 })
    let trunkCylinder = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunkCylinder.castShadow = true
    trunkCylinder.receiveShadow = false
    trunkCylinder.position.y += trunkHeight / 2
    this.el.setObject3D("trunk", trunkCylinder)

    let foliageGeometry = new THREE.TetrahedronGeometry(rnd(0.8, 2), 2)
    let foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 })
    let foliageTetrahedron = new THREE.Mesh(foliageGeometry, foliageMaterial)
    foliageTetrahedron.castShadow = true
    foliageTetrahedron.receiveShadow = false
    foliageTetrahedron.position.y += trunkHeight
    this.el.setObject3D("foliage", foliageTetrahedron)
  },
})

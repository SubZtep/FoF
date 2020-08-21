import { rnd } from "../utils"

AFRAME.registerComponent("tree-primitive", {
  init() {
    let scene = this.el.sceneEl.object3D
    let pos: THREE.Vector3 = this.el.object3D.position
    let scale: THREE.Vector3 = this.el.object3D.scale

    let trunkGeometry = new THREE.CylinderGeometry(0.1, 0.2, 3, 32)
    let trunkMaterial = new THREE.MeshBasicMaterial({ color: 0xa52a2a })
    let trunkCylinder = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunkCylinder.castShadow = true
    trunkCylinder.receiveShadow = false
    trunkCylinder.position.set(pos.x, pos.y + 1, pos.z)
    trunkCylinder.scale.set(scale.x, scale.y, scale.z)
    scene.add(trunkCylinder)

    let foliageGeometry = new THREE.TetrahedronGeometry(rnd(1, 1.5), 2)
    let foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 })
    let foliageTetrahedron = new THREE.Mesh(foliageGeometry, foliageMaterial)
    foliageTetrahedron.castShadow = true
    foliageTetrahedron.receiveShadow = false
    foliageTetrahedron.position.set(pos.x, pos.y + 2.5, pos.z)
    foliageTetrahedron.scale.set(scale.z, scale.y, scale.x)
    scene.add(foliageTetrahedron)
  },
})

AFRAME.registerPrimitive("a-tree", {
  defaultComponents: {
    "tree-primitive": {},
  },
})
